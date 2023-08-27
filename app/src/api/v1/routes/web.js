// child route
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');
const memberRoute = require('./memberRoute');

//---------------- Controllers ----------------
const homeController = require('../http/controllers/homeController');

function initRoutes(app) {

    // sites
    app.get('/', homeController().index);
    app.post('/send-contact', homeController().sendContact);
    app.get('/announcement', homeController().announcement);

    //auth
    app.use('/api/auth', authRoute);

    //admin
    app.use('/api/admin', adminRoute);

    //admin
    app.use('/api/member', memberRoute);

}

module.exports = initRoutes