const passport = require('passport');

exports.googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

exports.googleCallback = passport.authenticate('google', {
    failureRedirect: '/login',
});

exports.googleSuccess = (req, res) => {
    req.session.user = {
        id: req.user.id,
        googleId: req.user.googleId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
    };

    const redirectFrom = req.cookies.redirectFrom || 'http://localhost:3000';
    res.redirect(redirectFrom);
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.json({ success: true });
    });
};
