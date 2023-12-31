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
            const userInfo = req.payload;
            return res.render('admin/announcement/addAnnouncement' , { layout: 'admin/adminLayout', userInfo });
        },
        // [POST] / ADD ANNOUNCEMENT
        saveAnnouncement(req, res, next) {
            const announcement = new announcementModel({ 
                name: req.body.announcementName,
                status: req.body.announcementStatus,
                description: req.body.announcementDesc,
                content: req.body.announcementContent,
            });
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
                const userInfo = req.payload;
                const announcementDeletedCount = await announcementModel.countDocumentsDeleted();
                const announcements = await announcementModel.find().sort({ createdAt: -1 });
                return res.render('admin/announcement/allAnnouncement' , { layout: 'admin/adminLayout', userInfo, announcementDeletedCount, announcements, moment });
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
            const userInfo = req.payload;
            announcementModel.findById(req.params.id)
                .then(announcement => {
                    res.render('admin/announcement/editAnnouncement', { layout: 'admin/adminLayout', userInfo, announcement })
                })
                .catch(err => {
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
                const userInfo = req.payload;
                const deletedAnnouncements = await announcementModel.findDeleted();
                return res.render('admin/announcement/trashAnnouncement', { layout: 'admin/adminLayout', deletedAnnouncements, userInfo, moment });
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
            .then(() => {
                res.status(200).json({
                    message: 'Permanently delete this item successfully!'
                });
            })
            .catch(err => {
                next(err);
            })
        },
        // [POST] / UPLOAD IMG ANNOUNCEMENT
        imgCKEditorAnnouncement(req, res){
            try {
                fs.readFile(req.files.upload.path, function (err, data) {
                    let newImgName = Date.now() + "_" + req.files.upload.name;
                    var newPath = path.join(__dirname, '../../../../public/uploads/announcements/img_CKEditor/' + newImgName);
                    fs.writeFile(newPath, data, function (err) {
                        if (err) console.log({err: err});
                        else {
                            let fileName = newImgName;
                            let url = '/uploads/announcements/img_CKEditor/' + fileName;                    
                            let msg = 'Upload image successfully';
                            let funcNum = req.query.CKEditorFuncNum;
                           
                            res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
                        }
                    });
                });
            } catch (error) {
                next(error);;
            }
        },
        
    }
}

module.exports = announcementController