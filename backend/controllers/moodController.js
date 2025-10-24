const Mood = require('../models/moodModel');
const User = require('../models/userModel');

// @desc    Get all mood logs for a user
// @route   GET /api/mood
// @access  Private
const getMoods = async (req, res) => {
    try {
        // Tìm tất cả cảm xúc của người dùng đã đăng nhập, sắp xếp theo ngày
        const moods = await Mood.find({ user: req.user.id }).sort({ logDate: 'desc' });
        res.status(200).json(moods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Log or update a mood for a specific date
// @route   POST /api/mood
// @access  Private
const logMood = async (req, res) => {
    try {
        const { moodLevel, note, logDate } = req.body;

        // 1. Validation
        if (!moodLevel || !logDate) {
            return res.status(400).json({ message: 'Vui lòng cung cấp mức độ cảm xúc và ngày.' });
        }

        // 2. "Upsert" logic:
        // Tìm một bản ghi có user: req.user.id VÀ logDate: logDate
        // Nếu tìm thấy -> Cập nhật nó.
        // Nếu không tìm thấy -> Tạo một bản ghi mới.
        const updatedMood = await Mood.findOneAndUpdate(
            { user: req.user.id, logDate: new Date(logDate) }, // Điều kiện tìm kiếm
            { moodLevel, note }, // Dữ liệu để cập nhật hoặc tạo mới
            { 
                new: true, // Trả về bản ghi đã được cập nhật
                upsert: true, // Đây là "ma thuật": nếu không tìm thấy, hãy tạo mới
            }
        );

        res.status(201).json(updatedMood);
    } catch (error)
    {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMoods,
    logMood,
};