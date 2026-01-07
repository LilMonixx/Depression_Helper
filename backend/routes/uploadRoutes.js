const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();

// 1. Cấu hình Cloudinary (Lấy từ biến môi trường)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình nơi lưu là Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'depression-helper', // Tên thư mục trên cloud, đặt gì cũng đc
    allowed_formats: ['jpg', 'png', 'jpeg'], // Chỉ cho phép định dạng ảnh
  },
});

const upload = multer({ storage });

// 3. Route Upload
router.post('/', upload.single('image'), (req, res) => {
  // Cloudinary sẽ tự upload và trả về đường dẫn full (có https://...) trong req.file.path
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  
  // Trả về link ảnh trực tiếp từ Cloudinary
  res.send(req.file.path); 
});

module.exports = router;