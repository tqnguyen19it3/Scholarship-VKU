const express = require('express');
const router = express.Router();
const multipart = require('connect-multiparty');

// ---------------- Controllers ----------------
const adminController = require('../http/controllers/adminController');
const announcementController = require('../http/controllers/announcementController');
const scholarshipController = require('../http/controllers/scholarshipController');
const faqController = require('../http/controllers/faqController');
const funFactController = require('../http/controllers/funFactController');
const userManagementController = require('../http/controllers/userManagementController');
const aboutUsController = require('../http/controllers/aboutUsController');
const candidateController = require('../http/controllers/candidateController');

//---------------- Middleware ----------------
const auth = require('../../v1/http/middlewares/auth');
const { scholarshipUpload } = require('../../v1/http/middlewares/upload');
const multipartMiddleware = multipart();

//---------------- Router ----------------
router.get('/dashboard', [auth.isAuthentication, auth.isAdmin], adminController().index);
router.get('/admin-profile/:id', [auth.isAuthentication, auth.isAdmin], adminController().adminProfile);

// contact
router.get('/view-more-contact', [auth.isAuthentication, auth.isAdmin], adminController().viewMoreContact);
router.delete('/soft-delete-contact/:id', [auth.isAuthentication, auth.isAdmin], adminController().softDelContact);
router.get('/trash-contact', [auth.isAuthentication, auth.isAdmin], adminController().trashContact);
router.patch('/restore-contact/:id', [auth.isAuthentication, auth.isAdmin], adminController().restoreContact);
router.delete('/destroy-contact/:id', [auth.isAuthentication, auth.isAdmin], adminController().destroyContact);

// announcement
router.get('/add-announcement', [auth.isAuthentication, auth.isAdmin], announcementController().addAnnouncement);
router.post('/save-announcement', [auth.isAuthentication, auth.isAdmin], announcementController().saveAnnouncement);
router.get('/all-announcement', [auth.isAuthentication, auth.isAdmin], announcementController().allAnnouncement);
router.patch('/update-state-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().updateStateAnnouncement);
router.get('/edit-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().editAnnouncement);
router.put('/update-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().updateAnnouncement);
router.delete('/soft-delete-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().softDelAnnouncement);
router.get('/trash-announcement', [auth.isAuthentication, auth.isAdmin], announcementController().trashAnnouncement);
router.patch('/restore-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().restoreAnnouncement);
router.delete('/destroy-announcement/:id', [auth.isAuthentication, auth.isAdmin], announcementController().destroyAnnouncement);
router.post('/imgCKEditor-announcement-upload', [auth.isAuthentication, auth.isAdmin, multipartMiddleware], announcementController().imgCKEditorAnnouncement);

// scholarship
router.get('/add-scholarship', [auth.isAuthentication, auth.isAdmin], scholarshipController().addScholarship);
router.post('/save-scholarship', [auth.isAuthentication, auth.isAdmin, scholarshipUpload.single('scholarshipImage')], scholarshipController().saveScholarship);
router.get('/all-scholarship', [auth.isAuthentication, auth.isAdmin], scholarshipController().allScholarship);
router.patch('/update-state-scholarship/:id', [auth.isAuthentication, auth.isAdmin], scholarshipController().updateStateScholarship);
router.get('/edit-scholarship/:id', [auth.isAuthentication, auth.isAdmin], scholarshipController().editScholarship);
router.put('/update-scholarship/:id', [auth.isAuthentication, auth.isAdmin, scholarshipUpload.single('scholarshipImage')], scholarshipController().updateScholarship);
router.delete('/soft-delete-scholarship/:id', [auth.isAuthentication, auth.isAdmin], scholarshipController().softDelScholarship);
router.get('/trash-scholarship', [auth.isAuthentication, auth.isAdmin], scholarshipController().trashScholarship);
router.patch('/restore-scholarship/:id', [auth.isAuthentication, auth.isAdmin], scholarshipController().restoreScholarship);
router.delete('/destroy-scholarship/:id', [auth.isAuthentication, auth.isAdmin], scholarshipController().destroyScholarship);
router.post('/imgCKEditor-scholarship-upload', [auth.isAuthentication, auth.isAdmin, multipartMiddleware], scholarshipController().imgCKEditorScholarship);

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

// user management
router.get('/add-member', [auth.isAuthentication, auth.isAdmin], userManagementController().addMember);
router.post('/save-member', [auth.isAuthentication, auth.isAdmin], userManagementController().saveMember);
router.delete('/soft-delete-member/:id', [auth.isAuthentication, auth.isAdmin], userManagementController().softDelMember);
router.patch('/restore-member/:id', [auth.isAuthentication, auth.isAdmin], userManagementController().restoreMember);
router.delete('/destroy-member/:id', [auth.isAuthentication, auth.isAdmin], userManagementController().destroyMember);
    // fund
router.get('/fund-management-board', [auth.isAuthentication, auth.isAdmin], userManagementController().fundManagementBoard);
router.get('/trash-fund-management-board', [auth.isAuthentication, auth.isAdmin], userManagementController().trashFundManagementBoard);
    // sponsor
router.get('/sponsorship-management', [auth.isAuthentication, auth.isAdmin], userManagementController().sponsorshipManagement);
router.get('/trash-sponsorship-management', [auth.isAuthentication, auth.isAdmin], userManagementController().trashSponsorshipManagement);

// candidate
router.get('/all-candidate', [auth.isAuthentication, auth.isAdmin], candidateController().allCandidate);
router.get('/view-candidate-detail/:id', [auth.isAuthentication, auth.isAdmin], candidateController().viewCandidateDetail);
router.patch('/approved-candidate/:id', [auth.isAuthentication, auth.isAdmin], candidateController().approvedCandidate);
router.patch('/disapproved-candidate/:id', [auth.isAuthentication, auth.isAdmin], candidateController().disapprovedCandidate);
router.delete('/soft-delete-candidate/:id', [auth.isAuthentication, auth.isAdmin], candidateController().softDelCandidate);
router.get('/trash-candidate', [auth.isAuthentication, auth.isAdmin], candidateController().trashCandidate);
router.patch('/restore-candidate/:id', [auth.isAuthentication, auth.isAdmin], candidateController().restoreCandidate);
router.delete('/destroy-candidate/:id', [auth.isAuthentication, auth.isAdmin], candidateController().destroyCandidate);


// about us management
router.get('/about-us-management', [auth.isAuthentication, auth.isAdmin], aboutUsController().aboutUsManagement);
router.put('/update-general-introduction/:id', [auth.isAuthentication, auth.isAdmin], aboutUsController().updateGeneralIntroduction);
router.put('/update-development-journey/:id', [auth.isAuthentication, auth.isAdmin], aboutUsController().updateDevelopmentJourney);
router.put('/update-mission-statement-and-purpose/:id', [auth.isAuthentication, auth.isAdmin], aboutUsController().updateMissionStatementAndPurpose);
router.post('/imgCKEditor-general-introduction-upload', [auth.isAuthentication, auth.isAdmin, multipartMiddleware], aboutUsController().imgCKEditorGeneralIntroduction);
router.post('/imgCKEditor-development-journey-upload', [auth.isAuthentication, auth.isAdmin, multipartMiddleware], aboutUsController().imgCKEditorDevelopmentJourney);
router.post('/imgCKEditor-mission-statement-and-purpose-upload', [auth.isAuthentication, auth.isAdmin, multipartMiddleware], aboutUsController().imgCKEditorMissionStatementAndPurpose);

// client-side interface
router.get('/client-side-interface-information', [auth.isAuthentication, auth.isAdmin], adminController().CSIInfoView);
router.put('/update-client-side-interface-information/:id', [auth.isAuthentication, auth.isAdmin], adminController().updateCSIInfo);

module.exports = router;