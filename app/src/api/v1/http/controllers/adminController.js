const createError = require('http-errors');
const moment = require('moment');
//models
const userModel = require('../../models/user');
const contactModel = require('../../models/contact');

function adminController() {
    return {
        // [GET] / ADMIN DASHBOARD
        async index(req, res, next) {
            try {
                const adminInfo = req.payload;
                const contactInfo = await contactModel.find().sort({ createdAt: -1 }).limit(2);
                const contactCount = await contactModel.count();
                const deletedContactCount = await contactModel.countDocumentsDeleted();
                res.render('admin/dashboard/adminHome' , { layout: 'admin/adminLayout', adminInfo, contactInfo, contactCount, deletedContactCount, moment });
            } catch (error) {
                next(error);
            }
            
        },
        // [GET] / ADMIN PROFILE
        async adminProfile(req, res, next) {
            try{
                const adminInfo = req.payload;
                // const contactInfo = await contactModel.find().sort({ createdAt: -1 }).limit(2);
                // const contactCount = await contactModel.count();
                // const deletedContactCount = await contactModel.countDocumentsDeleted();
                // return res.render('admin/dashboard/adminProfile' , { layout: 'admin/adminLayout', adminInfo, contactInfo, contactCount, deletedContactCount, moment });
                return res.render('admin/dashboard/adminProfile' , { layout: 'admin/adminLayout', adminInfo });
            } catch (error) {
                next(error);
            }
        },
        // [GET] / VIEW MORE CONTACT AJAX
        async viewMoreContact(req, res, next) {
            try {
                const skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;
                // Lấy thêm  từ cơ sở dữ liệu
                const contacts = await contactModel.find().sort({ createdAt: -1 }).skip(skip).limit(2);
                // Trả về danh sách dưới dạng JSON
                res.status(200).json(contacts);
            } catch (error) {
                next(error);
            }
        },
        // [DELETE] / SOFT DELETE CONTACT
        softDelContact(req, res, next) {
            contactModel.delete({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Move the contact to the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [GET] / TRASH CONTACT PAGE
        async trashContact(req, res, next) {
            try {
                const adminInfo = req.payload;
                const deletedContacts = await contactModel.findDeleted();
                return res.render('admin/contact/trashContact', { layout: 'admin/adminLayout', deletedContacts, adminInfo, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / RESTORE CONTACT FROM TRASH
        restoreContact(req, res, next) {
            contactModel.restore({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Restore the contact from the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [DELETE] / DESTROY CONTACT FROM TRASH
        destroyContact(req, res, next) {
            contactModel.findOneAndDelete({ _id: req.params.id })
            .then((item) => {
                res.status(200).json({
                    message: 'Permanently delete this item successfully!'
                });
            })
            .catch(err => {
                next(err);
            })
        }
        
    }
}

module.exports = adminController