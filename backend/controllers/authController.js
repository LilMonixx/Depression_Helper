const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        //get data from request body
        const { displayName, email, password } = req.body;

        // simple validation
        if (!displayName || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // check for existing user
        const userExists = await User.findOne({ email }); // Sửa tên biến 'userExits' thành 'userExists'
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const user = new User({
            displayName,
            email,
            password: hashedPassword,
        });

        // --- DÒNG QUAN TRỌNG ĐƯỢC THÊM VÀO ---
        await user.save(); // Lưu người dùng vào database

        //if user created successfully, create token and send response
        // (Kiểm tra 'user' là đủ, vì nếu save() lỗi, nó sẽ nhảy vào catch)
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.status(201).json({
                _id: user._id,
                displayName: user.displayName,
                email: user.email,
                token: token,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error); // Thêm console.error để xem lỗi trong terminal
        res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        // 1. Get user data from request body
        const { email, password } = req.body;

        // 2. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 4. If everything is ok, create a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // 5. Send back user info and token
        res.status(200).json({
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
            token: token,
        });

    } catch (error) {
        console.error(error); // Thêm console.error để xem lỗi
        res.status(500).json({ message: 'Server Error' });
    }
};


// --- PHẦN SỬA LỖI CRASH ---
module.exports = {
    registerUser,
    loginUser, // Sửa 'LoginUser' thành 'loginUser'
};