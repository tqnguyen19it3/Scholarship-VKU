const express = require('express');
const router = express.Router();

// Controllers
const adminController = require('../http/controllers/adminController');

// Middleware
const auth = require('../../v1/http/middlewares/auth');

// Router
router.get('/dashboard', [auth.isAuthentication, auth.isAdmin], adminController().index);

module.exports = router;