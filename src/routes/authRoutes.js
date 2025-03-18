const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes
router.post('/register/init', authController.registerInit);
router.post('/register/complete', authController.registerComplete);
router.post('/login/init', authController.loginInit);
router.post('/login/complete', authController.loginComplete);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router; 