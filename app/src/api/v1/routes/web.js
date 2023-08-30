// child route
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');
const memberRoute = require('./memberRoute');

//---------------- Controllers ----------------
const homeController = require('../http/controllers/homeController');

//---------------- Middleware ----------------
const { uploadCandidate } = require('../../v1/http/middlewares/upload');

function initRoutes(app) {

    // sites
    app.get('/', homeController().index);
    app.post('/send-contact', homeController().sendContact);
    app.get('/thong-bao', homeController().announcements);
    app.get('/chi-tiet-thong-bao/:slug/:id', homeController().announcementDetail);
    app.get('/hoc-bong-nhan-ban', homeController().scholarships);
    app.get('/chi-tiet-hoc-bong-nhan-ban/:slug/:id', homeController().scholarshipDetail);
    app.get('/nop-ho-so/:slug/:id', homeController().applicationForm);
    app.post('/submit-candidate-profile/:id', [uploadCandidate.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'document', maxCount: 1 }
      ]),], homeController().submitCandidateProfile);

    //auth
    app.use('/api/auth', authRoute);

    //admin
    app.use('/api/admin', adminRoute);

    //admin
    app.use('/api/member', memberRoute);

}

module.exports = initRoutes