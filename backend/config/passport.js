const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // Thông tin Google trả về
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        };

        try {
          // 1. Kiểm tra xem user có googleId này chưa
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            return done(null, user);
          } else {
            // 2. Nếu chưa, kiểm tra xem email này đã đăng ký chưa
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
              // Nếu email đã có, cập nhật thêm googleId vào tài khoản đó
              user.googleId = profile.id;
              // Cập nhật avatar nếu chưa có
              if (!user.avatar) user.avatar = profile.photos[0].value;
              await user.save();
              return done(null, user);
            } else {
              // 3. Nếu chưa có gì hết, tạo user mới
              user = await User.create(newUser);
              return done(null, user);
            }
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email'], // Yêu cầu các trường này
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          facebookId: profile.id,
          displayName: profile.displayName,
          // Facebook đôi khi không trả về email nếu user đăng ký bằng sđt
          // Nên ta cần kiểm tra kỹ
          email: profile.emails ? profile.emails[0].value : `${profile.id}@facebook.com`, 
          avatar: profile.photos ? profile.photos[0].value : "",
        };

        try {
          let user = await User.findOne({ facebookId: profile.id });

          if (user) {
            return done(null, user);
          } else {
            user = await User.findOne({ email: newUser.email });

            if (user) {
              user.facebookId = profile.id;
              if (!user.avatar) user.avatar = newUser.avatar;
              await user.save();
              return done(null, user);
            } else {
              user = await User.create(newUser);
              return done(null, user);
            }
          }
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
    );    
};