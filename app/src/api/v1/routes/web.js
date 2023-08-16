// child route
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');

//---------------- Controllers ----------------
const homeController = require('../http/controllers/homeController');

function initRoutes(app) {

    // sites
    app.get('/', homeController().index);
    app.post('/send-contact', homeController().sendContact);

    //auth
    app.use('/api/auth', authRoute);

    //admin
    app.use('/api/admin', adminRoute);

}

module.exports = initRoutes