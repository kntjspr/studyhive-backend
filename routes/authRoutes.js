const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.loginWithOTP);
router.post('/verify-otp', authController.verifyOTP);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router; 