const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Liên kết với người dùng
        },
        moodLevel: {
            type: Number,
            required: true, // Ví dụ: 1 = Rất tệ, 5 = Rất tốt
        },
        note: {
            type: String,
            default: '', // Ghi chú ngắn, không bắt buộc
        },
        logDate: {
            type: Date,
            required: true, // Ngày mà người dùng ghi lại cảm xúc
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt
    }
);

const Mood = mongoose.model('Mood', moodSchema);

module.exports = Mood;