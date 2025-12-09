const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// 1. Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Lưu vào thư mục 'uploads' ở root backend
  },
  filename(req, file, cb) {
    // Đặt tên file: tên-gốc + ngày-tháng + đuôi-file (để tránh trùng)
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 2. Kiểm tra định dạng file (chỉ cho phép ảnh)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

// 3. Khởi tạo middleware upload
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 4. Tạo Route Upload
// Khi gọi POST /api/upload, nó sẽ xử lý 1 file có key là 'image'
router.post('/', upload.single('image'), (req, res) => {
  // Trả về đường dẫn file đã lưu để Frontend dùng
  res.send(`/${req.file.path.replace(/\\/g, "/")}`); 
});

module.exports = router;