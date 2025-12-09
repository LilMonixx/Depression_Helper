
const express = require('express');
const router = express.Router();
const {
    getAllContent,
    createContent,
    deleteContent,
    updateContent,
} = require('../controllers/healingContentController');

const { protect, admin } = require('../middleware/authMiddleware');
// --- Define the routes ---
router.route('/').get(getAllContent);
// GET /api/content (Lấy tất cả nội dung - Công khai)
// POST /api/content (Tạo nội dung mới - Dùng cho Postman)
router.route('/')
    .get(getAllContent)
    .post(createContent);
// DELETE /api/content/:id (Xoá nội dung - Dùng cho Postman)
router.route('/:id')
    .delete(protect, admin, deleteContent)
    .put(protect, admin, updateContent);

module.exports = router;