function authenticateSession(req, res, next) {
    if (req.isAuthenticated() && req.user) {
        console.log(req.user);
        return next(); // Nếu đã đăng nhập, tiếp tục thực hiện các Middleware hoặc xử lý tiếp theo
    } else {
        // Nếu chưa đăng nhập, trả về mã lỗi hoặc thông báo lỗi
        return res.status(401).json({ message: 'User not authenticated' });
    }
}

module.exports = authenticateSession;
