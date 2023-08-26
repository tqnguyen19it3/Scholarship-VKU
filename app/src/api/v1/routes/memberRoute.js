const express = require('express');
const router = express.Router();

// ---------------- Controllers ----------------
const memberController = require('../http/controllers/memberController');

//---------------- Middleware ----------------
const auth = require('../http/middlewares/auth');
const { memberAvatarUpload } = require('../../v1/http/middlewares/upload');

//---------------- Router ----------------
router.get('/profile/:id', [auth.isAuthentication, auth.isMember], memberController().memberProfile);
router.put('/update-info-member/:id', [auth.isAuthentication, auth.isMember, memberAvatarUpload.single('avatar')], memberController().updateInfoMember);

module.exports = router;