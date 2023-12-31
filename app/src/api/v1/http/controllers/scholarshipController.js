const createError = require('http-errors');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

//models
const scholarshipModel = require('../../models/scholarship');
const userModel = require('../../models/user');

function scholarshipController() {
    return {
        // [GET] / ADD SCHOLARSHIP PAGE
        async addScholarship(req, res, next) {
            const userInfo = req.payload;
            const sponsors = await userModel.find({ role: "Sponsor" });
            return res.render('admin/scholarship/addScholarship' , { layout: 'admin/adminLayout', userInfo, sponsors });
        },
        // [POST] / ADD SCHOLARSHIP
        saveScholarship(req, res, next) {
            const scholarship = new scholarshipModel({ 
                name: req.body.scholarshipName,
                total: req.body.scholarshipTotal,
                amount: req.body.scholarshipAmount,
                start_deadline: req.body.scholarshipStartDate,
                end_deadline: req.body.scholarshipEndDate,
                status: req.body.scholarshipStatus,
                description: req.body.scholarshipDesc,
                content: req.body.scholarshipContent,
            });
            if(req.body.scholarshipProvider){
                scholarship.provider = req.body.scholarshipProvider;
            }
            if(req.file){
                scholarship.image = req.file.filename;
            }
            scholarship.save()
                .then((response) => {
                    return res.cookie('adminSuccessMessage', 'Add scholarship successfully!').redirect('back');
                })
                .catch(err => {
                    return res.cookie('adminErrorMessage', 'Something went wrong!').redirect('back');
                });
        },
        // [GET] / ALL SCHOLARSHIP PAGE
        async allScholarship(req, res, next) {
            try {
                const userInfo = req.payload;
                const scholarshipDeletedCount = await scholarshipModel.countDocumentsDeleted();
                const scholarships = await scholarshipModel.find().sort({ createdAt: -1 });
                return res.render('admin/scholarship/allScholarship' , { layout: 'admin/adminLayout', userInfo, scholarshipDeletedCount, scholarships, moment });
            } catch (error) {
                next(error);
            }
        },
        // // [PATCH] / UPDATE STATE SCHOLARSHIP
        updateStateScholarship(req, res, next) {
            const id = req.params.id;
            const newStatus = req.body.status;
            scholarshipModel.findByIdAndUpdate(id, { status: newStatus }, { new: true })
            .then((response) => {
                return res.status(200).json({
                    message: 'Update scholarship state successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
         // [GET] / EDIT SCHOLARSHIP PAGE
        async editScholarship(req, res, next) {
            try {
              const userInfo = req.payload;
              const scholarship = await scholarshipModel.findById(req.params.id);
              const provider = await userModel.find({ role: "Sponsor" });
              res.render('admin/scholarship/editScholarship', { layout: 'admin/adminLayout', userInfo, scholarship, provider });
            } catch (err) {
              next(err);
            }
        },
        // // [PUT] / UPDATE SCHOLARSHIP
        updateScholarship(req, res, next) {
            const scholarship = { 
                name: req.body.scholarshipName,
                total: req.body.scholarshipTotal,
                amount: req.body.scholarshipAmount,
                start_deadline: req.body.scholarshipStartDate,
                end_deadline: req.body.scholarshipEndDate,
                status: req.body.scholarshipStatus,
                description: req.body.scholarshipDesc,
                content: req.body.scholarshipContent,
                provider: req.body.scholarshipProvider
            }
            if(!req.body.scholarshipProvider){
                scholarship.provider = [];
            }
            if(req.file){
                scholarshipModel.findById(req.params.id)
                    .then(item => {
                        if(item.image){
                            // Delete old image file exist
                            fs.unlink(path.join(__dirname, '../../../../public/uploads/scholarships/' + item.image), (err) => {
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

                scholarship.image = req.file.filename;
            }
            scholarshipModel.updateOne({ _id: req.params.id }, scholarship)
                .then(() => {
                    return res.cookie('adminSuccessMessage', 'Update scholarship successfully!').redirect('/api/admin/all-scholarship');
                })
                .catch(err => {
                    return res.cookie('adminErrorMessage', 'Something went wrong!').redirect('/api/admin/all-scholarship');
                });
        },
        // [DELETE] / SOFT DELETE SCHOLARSHIP
        softDelScholarship(req, res, next) {
            scholarshipModel.delete({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Move the scholarship to the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [GET] / TRASH SCHOLARSHIP PAGE
        async trashScholarship(req, res, next) {
            try {
                const userInfo = req.payload;
                const deletedScholarships = await scholarshipModel.findDeleted();
                return res.render('admin/scholarship/trashScholarship', { layout: 'admin/adminLayout', deletedScholarships, userInfo, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / RESTORE CONTACT FROM TRASH
        restoreScholarship(req, res, next) {
            scholarshipModel.restore({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Restore the scholarship from the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [DELETE] / DESTROY CONTACT FROM TRASH
        destroyScholarship(req, res, next) {
            scholarshipModel.findOneAndDelete({ _id: req.params.id })
            .then((item) => {
                if(item.image){
                    // Delete old image file exist
                    fs.unlink(path.join(__dirname, '../../../../public/uploads/scholarships/' + item.image), (err) => {
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
        },
        // [POST] / UPLOAD IMG SCHOLARSHIP
        imgCKEditorScholarship(req, res){
            try {
                fs.readFile(req.files.upload.path, function (err, data) {
                    let newImgName = Date.now() + "_" + req.files.upload.name;
                    var newPath = path.join(__dirname, '../../../../public/uploads/scholarships/img_CKEditor/' + newImgName);
                    fs.writeFile(newPath, data, function (err) {
                        if (err) console.log({err: err});
                        else {
                            let fileName = newImgName;
                            let url = '/uploads/scholarships/img_CKEditor/' + fileName;                    
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

module.exports = scholarshipController