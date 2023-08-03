const express = require('express');
const router = express.Router();

// Controllers
const authController = require('../http/controllers/authController');

// Middleware
const auth = require('../../v1/http/middlewares/auth');

// Router
router.post('/register', authController().register);
router.post('/login', authController().login);
router.post('/refresh-token', authController().refreshToken);
router.post('/google', authController().authGoogle);
router.delete('/logout', authController().logout);
router.post('/forgot-password', authController().forgotPassword);
router.post('/reset-password', [auth.isAuthentication], authController().resetPassword);

module.exports = router;