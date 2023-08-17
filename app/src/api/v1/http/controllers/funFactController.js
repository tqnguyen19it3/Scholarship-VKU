const createError = require('http-errors');
const moment = require('moment');

//models
const funFactModel = require('../../models/funFact');

function funFactController() {
    return {
        // [GET] / ADD FUN FACT PAGE
        async addFunFact(req, res, next) {
            const adminInfo = req.payload;
            return res.render('admin/fun-fact/addFunFact' , { layout: 'admin/adminLayout', adminInfo });
        },
        // [POST] / ADD FUN FACT
        saveFunFact(req, res, next) {
            const funFact = new funFactModel({ 
                name: req.body.funFactName,
                statistics: req.body.funFactStatistics,
                status: req.body.funFactStatus
            });
            funFact.save()
                .then((response) => {
                    return res.cookie('adminSuccessMessage', 'Add fun fact successfully!').redirect('back');
                })
                .catch(err => {
                    return res.cookie('adminErrorMessage', 'Something went wrong!').redirect('back');
                });
        },
        // [GET] / ALL FUN FACT PAGE
        async allFunFact(req, res, next) {
            try {
                const adminInfo = req.payload;
                const funFactDeletedCount = await funFactModel.countDocumentsDeleted();
                const funFacts = await funFactModel.find().sort({ createdAt: -1 });
                return res.render('admin/fun-fact/allFunFact' , { layout: 'admin/adminLayout', adminInfo, funFactDeletedCount, funFacts, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / UPDATE STATE FUN FACT
        updateStateFunFact(req, res, next) {
            const id = req.params.id;
            const newStatus = req.body.status;
            funFactModel.findByIdAndUpdate(id, { status: newStatus }, { new: true })
            .then((response) => {
                return res.status(200).json({
                    message: 'Update fun fact state successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
         // [GET] / EDIT FUN FACT PAGE
        editFunFact(req, res, next) {
            const adminInfo = req.payload;
            funFactModel.findById(req.params.id)
                .then(funFact => {
                    res.render('admin/fun-fact/editFunFact', { layout: 'admin/adminLayout', adminInfo, funFact })
                })
                .catch(err => {
                    next(err);
                });
        },
        // [PUT] / UPDATE FUN FACT
        updateFunFact(req, res, next) {
            const funFact = { 
                name: req.body.funFactName,
                statistics: req.body.funFactStatistics,
                status: req.body.funFactStatus
            }
            funFactModel.updateOne({ _id: req.params.id }, funFact)
                .then(() => {
                    return res.cookie('adminSuccessMessage', 'Update fun fact successfully!').redirect('/api/admin/all-fun-fact');
                })
                .catch(err => {
                    return res.cookie('adminErrorMessage', 'Something went wrong!').redirect('/api/admin/all-fun-fact');
                });
        },
        // [DELETE] / SOFT DELETE FUN FACT
        softDelFunFact(req, res, next) {
            funFactModel.delete({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Move the fun fact to the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [GET] / TRASH FUN FACT PAGE
        async trashFunFact(req, res, next) {
            try {
                const adminInfo = req.payload;
                const deletedFunFacts = await funFactModel.findDeleted();
                return res.render('admin/fun-fact/trashFunFact', { layout: 'admin/adminLayout', deletedFunFacts, adminInfo, moment });
            } catch (error) {
                next(error);
            }
        },
        // [PATCH] / RESTORE FUN FACT FROM TRASH
        restoreFunFact(req, res, next) {
            funFactModel.restore({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Restore the fun fact from the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [DELETE] / DESTROY FUN FACT FROM TRASH
        destroyFunFact(req, res, next) {
            funFactModel.findOneAndDelete({ _id: req.params.id })
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

module.exports = funFactController