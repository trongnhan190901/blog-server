const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID:
                '158973631788-kj3jm25t9s244vis5l2ergo8qmkjco5v.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:5000/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // Nếu không tìm thấy user, tạo user mới và lưu vào database
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        role: 'user',
                        avatar: profile.photos[0].value,
                    });
                    await user.save();
                }
                // Trả về thông tin user
                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        },
    ),
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
