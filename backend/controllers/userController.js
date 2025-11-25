const User = require('../models/userModel');
const Journal = require('../models/journalModel');
const Mood = require('../models/moodModel');

// @desc    Get user profile & stats
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
                journalCount, // Trả về số lượng
                moodCount,    // Trả về số lượng
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getUserProfile };