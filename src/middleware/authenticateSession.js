function authenticateSession(req, res, next) {
    if (req.isAuthenticated() && req.user) {
        return next();
    } else {
        return res.status(401).json({ message: 'User not authenticated' });
    }
}

module.exports = authenticateSession;
