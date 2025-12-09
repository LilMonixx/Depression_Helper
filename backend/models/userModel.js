const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        displayName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: false, // <-- QUAN TRỌNG: User Google không có mật khẩu
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        avatar: {
            type: String,
            default: "",
        },
        coverImage: {
            type: String,
            default: "",
        },
        googleId: {
            type: String, // <-- THÊM MỚI: ID từ Google
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;