const passport = require('passport');

const googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

const googleCallback = passport.authenticate('google', {
    failureRedirect: '/login',
});

const googleSuccess = (req, res) => {
    req.session.user = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
    };

    res.redirect('http://localhost:3000');
};

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.redirect('/login');
    });
};

module.exports = {
    googleLogin,
    googleCallback,
    googleSuccess,
    logout,
};
