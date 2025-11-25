const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Route này cần đăng nhập mới xem được
router.get('/profile', protect, getUserProfile);

module.exports = router;