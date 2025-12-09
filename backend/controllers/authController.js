const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { displayName, email, password } = req.body;

        if (!displayName || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Kiểm tra user tồn tại
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user
        const user = await User.create({
            displayName,
            email,
            password: hashedPassword,
        });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.status(201).json({
                _id: user._id,
                displayName: user.displayName,
                email: user.email,
                isAdmin: user.isAdmin,
                avatar: user.avatar,       // <-- Trả về avatar
                coverImage: user.coverImage, // <-- Trả về cover
                token: token,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user (Đăng nhập)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            // Trả về đầy đủ thông tin
            res.status(200).json({
                _id: user._id,
                displayName: user.displayName,
                email: user.email,
                isAdmin: user.isAdmin,
                avatar: user.avatar,         // <-- Trả về avatar
                coverImage: user.coverImage, // <-- Trả về cover
                token: token,
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};