const createError = require('http-errors');
const moment = require('moment');

//models
const userModel = require('../../models/user');

function userManagementController() {
    return {
        // [GET] / FUND MANAGEMENT
        async fundManagement(req, res, next) {
            try {
                const adminInfo = req.payload;
                const fundManagement = await userModel.find({ role: "regular" }).sort({ createdAt: -1 });
                res.render('admin/user-management/fundManagement' , { layout: 'admin/adminLayout', adminInfo, fundManagement });
            } catch (error) {
                next(error);
            }
        },
        // [GET] / PARTNER MANAGEMENT
        async partnerManagement(req, res, next) {
            try {
                const adminInfo = req.payload;
                const partnerManagement = await userModel.find({ role: "partner" }).sort({ createdAt: -1 });
                res.render('admin/user-management/partnerManagement' , { layout: 'admin/adminLayout', adminInfo, partnerManagement });
            } catch (error) {
                next(error);
            }
        },

    }
}

module.exports = userManagementController