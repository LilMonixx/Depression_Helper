const Mood = require('../models/moodModel');

// @desc    Get all mood logs for a user
// @route   GET /api/mood
// @access  Private
const getMoods = async (req, res) => {
    try {
        // Sắp xếp theo createdAt giảm dần (mới nhất lên đầu)
        const moods = await Mood.find({ user: req.user.id }).sort({ createdAt: 'desc' });
        res.status(200).json(moods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Log a new mood entry
// @route   POST /api/mood
// @access  Private
const logMood = async (req, res) => {
    try {
        const { moodLevel, note } = req.body; // <-- Chỉ nhận 2 trường này

        // 1. Validation
        if (!moodLevel) {
            return res.status(400).json({ message: 'Vui lòng cung cấp mức độ cảm xúc.' });
        }

        // 2. Lấy ngày hôm nay (set về 0 giờ để nhóm cho dễ)
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        // 3. TẠO MỚI một bản ghi (không cập nhật/upsert)
        const newMood = await Mood.create({
            user: req.user.id,
            moodLevel,
            note,
            logDate: today, // Vẫn lưu lại ngày để nhóm
        });

        res.status(201).json(newMood);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMoods,
    logMood,
};