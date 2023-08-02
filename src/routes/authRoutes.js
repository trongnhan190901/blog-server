const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/google', authController.googleLogin);

router.get(
    '/google/callback',
    authController.googleCallback,
    authController.googleSuccess,
);

router.get('/logout', authController.logout);

module.exports = router;
