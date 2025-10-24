const express = require('express');
const router = express.Router();
const { getMoods, logMood } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

// Áp dụng "người gác cổng" protect cho tất cả các route bên dưới
router.use(protect);

// Định nghĩa routes
// GET /api/mood (để lấy lịch sử)
// POST /api/mood (để ghi cảm xúc mới)
router.route('/')
    .get(getMoods)
    .post(logMood);

module.exports = router;