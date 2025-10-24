const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Đây là liên kết quan trọng tới Bảng 'User'
        },
        title: {
            type: String,
            required: [true, 'Please add a title'], // Thêm thông báo lỗi
        },
        content: {
            type: String,
            required: [true, 'Please add content'],
        },
    },
    {
        timestamps: true, // Tự động thêm createdAt và updatedAt
    }
);

const Journal = mongoose.model('Journal', journalSchema);

module.exports = Journal;