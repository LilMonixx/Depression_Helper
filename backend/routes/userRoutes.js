const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Route này cần đăng nhập mới xem được
// GET: Lấy thông tin & thống kê
// PUT: Cập nhật thông tin (Tên, Avatar, Ảnh bìa)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;