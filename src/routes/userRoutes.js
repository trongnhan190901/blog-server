const express = require('express');
const router = express.Router();
const authenticateSession = require('../middleware/authenticateSession');
const userController = require('../controllers/userController');

router.get('/', authenticateSession, (req, res) => {
    const user = req.user;
    res.json(user);
});

router.get('/:googleId', userController.getUserByGoogleId);

module.exports = router;
