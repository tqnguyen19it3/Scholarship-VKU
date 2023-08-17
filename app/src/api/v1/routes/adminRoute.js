const express = require('express');
const router = express.Router();

// ---------------- Controllers ----------------
const adminController = require('../http/controllers/adminController');
const announcementController = require('../http/controllers/announcementController');
const faqController = require('../http/controllers/faqController');
const funFactController = require('../http/controllers/funFactController');

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

// faq
router.get('/add-faq', [auth.isAuthentication, auth.isAdmin], faqController().addFaq);
router.post('/save-faq', [auth.isAuthentication, auth.isAdmin], faqController().saveFaq);
router.get('/all-faq', [auth.isAuthentication, auth.isAdmin], faqController().allFaq);
router.patch('/update-state-faq/:id', [auth.isAuthentication, auth.isAdmin], faqController().updateStateFaq);
router.get('/edit-faq/:id', [auth.isAuthentication, auth.isAdmin], faqController().editFaq);
router.put('/update-faq/:id', [auth.isAuthentication, auth.isAdmin], faqController().updateFaq);
router.delete('/soft-delete-faq/:id', [auth.isAuthentication, auth.isAdmin], faqController().softDelFaq);
router.get('/trash-faq', [auth.isAuthentication, auth.isAdmin], faqController().trashFaq);
router.patch('/restore-faq/:id', [auth.isAuthentication, auth.isAdmin], faqController().restoreFaq);
router.delete('/destroy-faq/:id', [auth.isAuthentication, auth.isAdmin], faqController().destroyFaq);

// fun fact
router.get('/add-fun-fact', [auth.isAuthentication, auth.isAdmin], funFactController().addFunFact);
router.post('/save-fun-fact', [auth.isAuthentication, auth.isAdmin], funFactController().saveFunFact);
router.get('/all-fun-fact', [auth.isAuthentication, auth.isAdmin], funFactController().allFunFact);
router.patch('/update-state-fun-fact/:id', [auth.isAuthentication, auth.isAdmin], funFactController().updateStateFunFact);
router.get('/edit-fun-fact/:id', [auth.isAuthentication, auth.isAdmin], funFactController().editFunFact);
router.put('/update-fun-fact/:id', [auth.isAuthentication, auth.isAdmin], funFactController().updateFunFact);
router.delete('/soft-delete-fun-fact/:id', [auth.isAuthentication, auth.isAdmin], funFactController().softDelFunFact);
router.get('/trash-fun-fact', [auth.isAuthentication, auth.isAdmin], funFactController().trashFunFact);
router.patch('/restore-fun-fact/:id', [auth.isAuthentication, auth.isAdmin], funFactController().restoreFunFact);
router.delete('/destroy-fun-fact/:id', [auth.isAuthentication, auth.isAdmin], funFactController().destroyFunFact);

module.exports = router;