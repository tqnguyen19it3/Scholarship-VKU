const createError = require('http-errors');
const moment = require('moment');

//models
const contactModel = require('../../models/contact');
const userModel = require('../../models/user');
const CSI_infoModel = require('../../models/CSI_info');
const announcementModel = require('../../models/announcement');
const candidateModel = require('../../models/candidate');
const scholarshipModel = require('../../models/scholarship');

function adminController() {
    return {
        // [GET] / ADMIN DASHBOARD
        async index(req, res, next) {
            try {
                const userInfo = req.payload;
                const contactInfo = await contactModel.find().sort({ createdAt: -1 }).limit(2);
                const contactCount = await contactModel.count();
                const deletedContactCount = await contactModel.countDocumentsDeleted();
                const announcementCount = await announcementModel.count();
                const scholarshipCount = await scholarshipModel.count();
                const candidateCount = await candidateModel.count();
                const userCount = await userModel.count();
                res.render('admin/dashboard/adminHome' , { layout: 'admin/adminLayout', userInfo, contactInfo, contactCount, deletedContactCount, announcementCount, scholarshipCount, userCount, candidateCount, moment });
            } catch (error) {
                next(error);
            }
            
        },
        // [GET] / ADMIN PROFILE
        async adminProfile(req, res, next) {
            try{
                const userId = req.params.id;
                const userInfo = await userModel.findById(userId);

                if (!userInfo) {
                    throw createError.NotFound(`Failed! This user profile could not be found`);
                }

                if(userInfo._id.toString() !== req.payload._id){
                    throw createError.Forbidden(`Failed! You are not authorized to access this user profile`);
                }

                return res.render('admin/dashboard/adminProfile' , { layout: 'admin/adminLayout', userInfo });

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
                const userInfo = req.payload;
                const deletedContacts = await contactModel.findDeleted();
                return res.render('admin/contact/trashContact', { layout: 'admin/adminLayout', deletedContacts, userInfo, moment });
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
        },
        // [GET] / CSIInfo View
        async CSIInfoView(req, res, next) {
            try {
                const userInfo = req.payload;
                const CSIInfo = await CSI_infoModel.findOne();
                res.render('admin/client-side/interfaceInfo' , { layout: 'admin/adminLayout', userInfo, CSIInfo });
            } catch (error) {
                next(error);
            }
        },
        // [PUT] / UPDATE CSIInfo
        updateCSIInfo(req, res, next) {
            const CSIInfo = { 
                address: req.body.CSIInfoAddress,
                email: req.body.CSIInfoEmail,
                phoneNumber: req.body.CSIInfoPhoneNumber,
                workingDates: req.body.CSIInfoWorkingDates,
                workingHours: req.body.CSIInfoWorkingHours,
                maps: req.body.CSIInfoMaps,
                footerContent: req.body.CSIInfoFooterContent
            }
            CSI_infoModel.updateOne({ _id: req.params.id }, CSIInfo)
                .then(() => {
                    return res.cookie('adminSuccessMessage', 'Update successfully!').redirect('/api/admin/client-side-interface-information');
                })
                .catch(err => {
                    return res.cookie('adminErrorMessage', 'Something went wrong!').redirect('/api/admin/client-side-interface-information');
                });
        },
    }
}

module.exports = adminController