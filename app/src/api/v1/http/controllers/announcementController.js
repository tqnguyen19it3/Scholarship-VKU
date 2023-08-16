const createError = require('http-errors');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

//models
const announcementModel = require('../../models/announcement');

function announcementController() {
    return {
        // [GET] / ADD ANNOUNCEMENT PAGE
        async addAnnouncement(req, res, next) {
            const adminInfo = req.payload;
            return res.render('admin/announcement/addAnnouncement' , { layout: 'admin/adminLayout', adminInfo });
        },
        // [POST] / ADD ANNOUNCEMENT
        saveAnnouncement(req, res, next) {
            const announcement = new announcementModel({ 
                name: req.body.announcementName,
                status: req.body.announcementStatus,
                description: req.body.announcementDesc,
                content: req.body.announcementContent,
            });
            if(req.file){
                announcement.image = req.file.filename;
            }
            announcement.save()
                .then((response) => {
                    return res.cookie('adminSuccessMessage', 'Add announcement successfully!').redirect('back');
                })
                .catch(err => {
                    return res.cookie('adminErrorMessage', 'Something went wrong!').redirect('back');
                });
        },
        // [GET] / ALL ANNOUNCEMENT PAGE
        async allAnnouncement(req, res, next) {
            try {
                const adminInfo = req.payload;
                const announcementDeletedCount = await announcementModel.countDocumentsDeleted();
                const announcements = await announcementModel.find().sort({ createdAt: -1 });
                return res.render('admin/announcement/allAnnouncement' , { layout: 'admin/adminLayout', adminInfo, announcementDeletedCount, announcements, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / UPDATE STATE ANNOUNCEMENT
        updateStateAnnouncement(req, res, next) {
            const id = req.params.id;
            const newStatus = req.body.status;
            announcementModel.findByIdAndUpdate(id, { status: newStatus }, { new: true })
            .then((response) => {
                return res.status(200).json({
                    message: 'Update announcement state successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
         // [GET] / EDIT ANNOUNCEMENT PAGE
        editAnnouncement(req, res, next) {
            const adminInfo = req.payload;
            announcementModel.findById(req.params.id)
                .then(announcement => {
                    console.log("ann ne 123", announcement);
                    res.render('admin/announcement/editAnnouncement', { layout: 'admin/adminLayout', adminInfo, announcement })
                })
                .catch(err => {
                    console.log("error ne", err);
                    next(err);
                });
        },
        // [PUT] / UPDATE ANNOUNCEMENT
        updateAnnouncement(req, res, next) {
            const announcement = { 
                name: req.body.announcementName,
                status: req.body.announcementStatus,
                description: req.body.announcementDesc,
                content: req.body.announcementContent,
            }
            if(req.file){
                announcementModel.findById(req.params.id)
                    .then(ann => {
                        if(ann.image){
                            // Delete old image file exist
                            fs.unlink(path.join(__dirname, '../../../../public/uploads/announcements/' + ann.image), (err) => {
                                if (err) {
                                    console.error(err);
                                    return;
                                }
                            })
                        }
                    })
                    .catch(err => {
                        next(err);
                    });

                announcement.image = req.file.filename;
            }
            announcementModel.updateOne({ _id: req.params.id }, announcement)
                .then(() => {
                    return res.cookie('adminSuccessMessage', 'Update announcement successfully!').redirect('/api/admin/all-announcement');
                })
                .catch(err => {
                    return res.cookie('adminErrorMessage', 'Something went wrong!').redirect('/api/admin/all-announcement');
                });
        },
        // [DELETE] / SOFT DELETE ANNOUNCEMENT
        softDelAnnouncement(req, res, next) {
            announcementModel.delete({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Move the announcement to the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [GET] / TRASH ANNOUNCEMENT PAGE
        async trashAnnouncement(req, res, next) {
            try {
                const adminInfo = req.payload;
                const deletedAnnouncements = await announcementModel.findDeleted();
                return res.render('admin/announcement/trashAnnouncement', { layout: 'admin/adminLayout', deletedAnnouncements, adminInfo, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / RESTORE CONTACT FROM TRASH
        restoreAnnouncement(req, res, next) {
            announcementModel.restore({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Restore the announcement from the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [DELETE] / DESTROY CONTACT FROM TRASH
        destroyAnnouncement(req, res, next) {
            announcementModel.findOneAndDelete({ _id: req.params.id })
            .then((item) => {
                if(item.image){
                    // Delete old image file exist
                    fs.unlink(path.join(__dirname, '../../../../public/uploads/announcements/' + item.image), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    })
                }
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

module.exports = announcementController