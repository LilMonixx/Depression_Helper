const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // SỬA Ở ĐÂY: Dùng biến môi trường thay vì chuỗi cứng
        callbackURL: process.env.GOOGLE_CALLBACK_URL, 
        // Nếu muốn chắc ăn hơn khi chạy sau proxy của Render:
        proxy: true, 
      },
      async (accessToken, refreshToken, profile, done) => {
        // ... (Giữ nguyên logic cũ của bạn) ...
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            return done(null, user);
          } else {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.googleId = profile.id;
              if (!user.avatar) user.avatar = profile.photos[0].value;
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

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        // SỬA Ở ĐÂY:
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'photos', 'email'],
        // Thêm dòng này cho Facebook luôn:
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
         // ... (Giữ nguyên logic cũ của bạn) ...
         const newUser = {
          facebookId: profile.id,
          displayName: profile.displayName,
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