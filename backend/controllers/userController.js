const User = require('../models/userModel');
const Journal = require('../models/journalModel');
const Mood = require('../models/moodModel');

// @desc    Get user profile & stats (Lấy thông tin và thống kê)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        // 1. Lấy thông tin user (bỏ password)
        const user = await User.findById(req.user.id).select('-password');

        if (user) {
            // 2. Đếm số lượng bài viết nhật ký
            const journalCount = await Journal.countDocuments({ user: req.user.id });
            
            // 3. Đếm số lần ghi cảm xúc
            const moodCount = await Mood.countDocuments({ user: req.user.id });

            res.json({
                _id: user._id,
                displayName: user.displayName,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
                // --- Trả về ảnh để hiển thị ---
                avatar: user.avatar,      
                coverImage: user.coverImage,
                // -----------------------------
                journalCount, 
                moodCount,    
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile (Cập nhật Avatar, Cover, Tên)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            // Cập nhật thông tin nếu có gửi lên
            user.displayName = req.body.displayName || user.displayName;
            user.avatar = req.body.avatar || user.avatar;
            user.coverImage = req.body.coverImage || user.coverImage;
            
            // Nếu có đổi mật khẩu
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            // --- QUAN TRỌNG: Đếm lại số liệu để trả về (tránh bị mất thống kê ở Frontend) ---
            const journalCount = await Journal.countDocuments({ user: req.user.id });
            const moodCount = await Mood.countDocuments({ user: req.user.id });
            // -------------------------------------------------------------------------------

            res.json({
                _id: updatedUser._id,
                displayName: updatedUser.displayName,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                avatar: updatedUser.avatar,
                coverImage: updatedUser.coverImage,
                createdAt: updatedUser.createdAt,
                token: req.headers.authorization.split(' ')[1], // Giữ nguyên token
                journalCount, 
                moodCount,    
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getUserProfile, updateUserProfile };