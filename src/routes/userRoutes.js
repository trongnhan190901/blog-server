const express = require('express');
const router = express.Router();
const authenticateSession = require('../middleware/authenticateSession');

router.get('/', authenticateSession, (req, res) => {
    const user = req.user;
    res.json(user);
});

module.exports = router;
