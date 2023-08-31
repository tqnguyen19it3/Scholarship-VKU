const createError = require('http-errors');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { sendEmailApprovedCandidate, sendEmailDisapprovedCandidate } = require('../../../../services/sendMail.service');

//models
const candidateModel = require('../../models/candidate');
const scholarshipModel = require('../../models/scholarship');


function candidateController() {
    return {
        // [GET] / ALL CANDIDATE PAGE
        async allCandidate(req, res, next) {
            try {
                const userInfo = req.payload;
                const candidateDeletedCount = await candidateModel.countDocumentsDeleted();
                const pendingCandidates = await candidateModel.find({isApproved: "pending"}).populate('scholarshipId').exec();
                const approvedCandidates = await candidateModel.find({isApproved: "approved"}).populate('scholarshipId').exec();
                const disapprovedCandidates = await candidateModel.find({isApproved: "disapproved"}).populate('scholarshipId').exec();
                return res.render('admin/candidate/candidateList' , { layout: 'admin/adminLayout', userInfo, candidateDeletedCount, pendingCandidates, approvedCandidates, disapprovedCandidates, moment });
            } catch (error) {
                next(error);
            }
        },
        // [GET] / VIEW CANDIDATE DETAIL PAGE
        async viewCandidateDetail(req, res, next) {
            try {
                const userInfo = req.payload;
                const candidate = await candidateModel.findById(req.params.id).populate('scholarshipId').exec();
                if (!candidate) {
                    throw createError.NotFound(`Failed! No profile found for this candidate`);
                }
                return res.render('admin/candidate/candidateDetail' , { layout: 'admin/adminLayout', userInfo, candidate, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / APPROVED CANDIDATE
        async approvedCandidate(req, res, next) {
            try {
                const id = req.params.id;
                const candidate = await candidateModel.findById(id).populate('scholarshipId').exec();
                if(candidate.scholarshipId.total < 1){
                    res.cookie('adminErrorMessage', 'The number of scholarships has been exhausted!');
                    res.redirect('back');
                }else{
                    const approved = req.body.approved;
                    const response = await candidateModel.findByIdAndUpdate(id, { isApproved: approved }, { new: true });
                    if (response) {
                        await scholarshipModel.findByIdAndUpdate(response.scholarshipId, { $inc: { total: -1 } });
                        // send mail to candidate
                        await sendEmailApprovedCandidate(
                            response.email,
                            response.name,
                            "Announcement of application results",
                            `<p>Notification of successful application</p>`
                        ); 
                        res.cookie('adminSuccessMessage', 'Approved candidate successfully!');
                        res.redirect('back');
                    }
                }
            } catch (err) {
                (err);
            }
        },
        // [PATCH] / DISAPPROVED CANDIDATE
        async  disapprovedCandidate(req, res, next) {
            try {
                const id = req.params.id;
                const disapproved = req.body.disapproved;
                const response = await candidateModel.findByIdAndUpdate(id, { isApproved: disapproved }, { new: true });
                await sendEmailDisapprovedCandidate(
                    response.email,
                    response.name,
                    "Announcement of application results",
                    `<p>Notification of application failure</p>`
                ); 
                res.cookie('adminSuccessMessage', 'Disapproved candidate successfully!');
                res.redirect('back');
            } catch (err) {
                next(err);
            }
        },
        // [DELETE] / SOFT DELETE CANDIDATE
        softDelCandidate(req, res, next) {
            candidateModel.delete({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Move the candidate to the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [GET] / TRASH CANDIDATE PAGE
        async trashCandidate(req, res, next) {
            try {
                const userInfo = req.payload;
                const deletedCandidates = await candidateModel.findDeleted().populate('scholarshipId').exec();
                return res.render('admin/candidate/trashCandidate', { layout: 'admin/adminLayout', deletedCandidates, userInfo, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / RESTORE CONTACT FROM TRASH
        restoreCandidate(req, res, next) {
            candidateModel.restore({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Restore the candidate from the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [DELETE] / DESTROY CONTACT FROM TRASH
        destroyCandidate(req, res, next) {
            candidateModel.findOneAndDelete({ _id: req.params.id })
            .then((item) => {
                if(item.avatar){
                    // Delete old image file exist
                    fs.unlink(path.join(__dirname, '../../../../public/uploads/candidates/avatar/' + item.avatar), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    })
                }
                if(item.document){
                    // Delete old image file exist
                    fs.unlink(path.join(__dirname, '../../../../public/uploads/candidates/form/' + item.document), (err) => {
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

module.exports = candidateController