const express = require('express');
const router = express.Router();
const {
    getAllContent,
    createContent,
} = require('../controllers/healingContentController');

// --- Define the routes ---

// GET /api/content (Lấy tất cả nội dung - Công khai)
// POST /api/content (Tạo nội dung mới - Dùng cho Postman)
router.route('/')
    .get(getAllContent)
    .post(createContent);

module.exports = router;