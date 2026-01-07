const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser } = require('../controllers/authController');

// --- HÀM TẠO TOKEN ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- ĐĂNG NHẬP / ĐĂNG KÝ THƯỜNG ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// ==========================================
// --- GOOGLE AUTHENTICATION ---
// ==========================================

// 1. Gửi yêu cầu đến Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google gọi lại (Callback)
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Tạo token
    const token = generateToken(req.user._id);
    
    
    const redirectUrl = `${process.env.CLIENT_URL}?token=${token}`;
    
    res.redirect(redirectUrl);
  }
);

// ==========================================
// --- FACEBOOK AUTHENTICATION ---
// ==========================================

// 1. Gửi yêu cầu đến Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// 2. Facebook gọi lại (Callback)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);
   
    const redirectUrl = `${process.env.CLIENT_URL}?token=${token}`;
    
    res.redirect(redirectUrl);
  }
);

module.exports = router;