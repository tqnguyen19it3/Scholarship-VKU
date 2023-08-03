// child route
const authRoute = require('./authRoute');

// Controllers
const homeController = require('../http/controllers/homeController');

function initRoutes(app) {

    // sites
    app.get('/', homeController().index);

    //auth
    app.use('/api/auth', authRoute);

}

module.exports = initRoutes