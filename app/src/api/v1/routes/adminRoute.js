const express = require('express');
const router = express.Router();

// ---------------- Controllers ----------------
const adminController = require('../http/controllers/adminController');
const announcementController = require('../http/controllers/announcementController');

//---------------- Middleware ----------------
const auth = require('../../v1/http/middlewares/auth');
const upload = require('../../v1/http/middlewares/upload');

//---------------- Router ----------------
router.get('/dashboard', [auth.isAuthentication, auth.isAdmin], adminController().index);
router.get('/admin-profile/:id', [auth.isAuthentication, auth.isAdmin], adminController().adminProfile);
router.get('/view-more-contact', [auth.isAuthentication, auth.isAdmin], adminController().viewMoreContact);
router.delete('/soft-delete-contact/:id', [auth.isAuthentication, auth.isAdmin], adminController().softDelContact);
router.get('/trash-contact', [auth.isAuthentication, auth.isAdmin], adminController().trashContact);
router.patch('/restore-contact/:id', [auth.isAuthentication, auth.isAdmin], adminController().restoreContact);
router.delete('/destroy-contact/:id', [auth.isAuthentication, auth.isAdmin], adminController().destroyContact);

// announcement
router.get('/add-announcement', [auth.isAuthentication, auth.isAdmin], announcementController().addAnnouncement);
router.post('/save-announcement', [auth.isAuthentication, auth.isAdmin, upload.single('announcementImage')], announcementController().saveAnnouncement);
router.get('/all-announcement', [auth.isAuthentication, auth.isAdmin], announcementController().allAnnouncement);
router.patch('/update-state-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().updateStateAnnouncement);
router.get('/edit-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().editAnnouncement);
router.put('/update-announcement/:id', [auth.isAuthentication, auth.isAdmin, upload.single('announcementImage')], announcementController().updateAnnouncement);
router.delete('/soft-delete-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().softDelAnnouncement);
router.get('/trash-announcement', [auth.isAuthentication, auth.isAdmin], announcementController().trashAnnouncement);
router.patch('/restore-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().restoreAnnouncement);
router.delete('/destroy-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().destroyAnnouncement);

module.exports = router;