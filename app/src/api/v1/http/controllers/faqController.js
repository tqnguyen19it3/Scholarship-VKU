const createError = require('http-errors');
const moment = require('moment');

//models
const faqModel = require('../../models/faq');

function faqController() {
    return {
        // [GET] / ADD FAQ PAGE
        async addFaq(req, res, next) {
            const adminInfo = req.payload;
            return res.render('admin/faq/addFaq' , { layout: 'admin/adminLayout', adminInfo });
        },
        // [POST] / ADD FAQ
        saveFaq(req, res, next) {
            const faq = new faqModel({ 
                question: req.body.faqQuestion,
                answer: req.body.faqAnswer,
                status: req.body.faqStatus
            });
            faq.save()
                .then((response) => {
                    return res.cookie('adminSuccessMessage', 'Add FAQ successfully!').redirect('back');
                })
                .catch(err => {
                    return res.cookie('adminErrorMessage', 'Something went wrong!').redirect('back');
                });
        },
        // [GET] / ALL FAQ PAGE
        async allFaq(req, res, next) {
            try {
                const adminInfo = req.payload;
                const faqDeletedCount = await faqModel.countDocumentsDeleted();
                const faqs = await faqModel.find().sort({ createdAt: -1 });
                return res.render('admin/faq/allFaq' , { layout: 'admin/adminLayout', adminInfo, faqDeletedCount, faqs, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / UPDATE STATE FAQ
        updateStateFaq(req, res, next) {
            const id = req.params.id;
            const newStatus = req.body.status;
            faqModel.findByIdAndUpdate(id, { status: newStatus }, { new: true })
            .then((response) => {
                return res.status(200).json({
                    message: 'Update FAQ state successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
         // [GET] / EDIT FAQ PAGE
        editFaq(req, res, next) {
            const adminInfo = req.payload;
            faqModel.findById(req.params.id)
                .then(faq => {
                    res.render('admin/faq/editFaq', { layout: 'admin/adminLayout', adminInfo, faq })
                })
                .catch(err => {
                    next(err);
                });
        },
        // [PUT] / UPDATE FAQ
        updateFaq(req, res, next) {
            const faq = { 
                question: req.body.faqQuestion,
                answer: req.body.faqAnswer,
                status: req.body.faqStatus
            }
            faqModel.updateOne({ _id: req.params.id }, faq)
                .then(() => {
                    return res.cookie('adminSuccessMessage', 'Update FAQ successfully!').redirect('/api/admin/all-faq');
                })
                .catch(err => {
                    return res.cookie('adminErrorMessage', 'Something went wrong!').redirect('/api/admin/all-faq');
                });
        },
        // [DELETE] / SOFT DELETE FAQ
        softDelFaq(req, res, next) {
            faqModel.delete({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Move the FAQ to the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [GET] / TRASH FAQ PAGE
        async trashFaq(req, res, next) {
            try {
                const adminInfo = req.payload;
                const deletedFaqs = await faqModel.findDeleted();
                return res.render('admin/faq/trashFaq', { layout: 'admin/adminLayout', deletedFaqs, adminInfo, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / RESTORE FAQ FROM TRASH
        restoreFaq(req, res, next) {
            faqModel.restore({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Restore the FAQ from the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [DELETE] / DESTROY FAQ FROM TRASH
        destroyFaq(req, res, next) {
            faqModel.findOneAndDelete({ _id: req.params.id })
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

module.exports = faqController