const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem token có trong header 'Authorization' không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header (Bỏ chữ 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token để lấy user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Lấy thông tin user từ ID (trừ mật khẩu) và gắn vào req
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép đi tiếp tới hàm controller (getJournals)
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' }); 
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };