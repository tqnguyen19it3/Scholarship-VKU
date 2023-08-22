const createError = require('http-errors');
const moment = require('moment');

//models
const aboutUsModel = require('../../models/about_us');

function aboutUsController() {
    return {
        // [GET] / ABOUT US MANAGEMENT PAGE
        async aboutUsManagement(req, res, next) {
            try {
                const adminInfo = req.payload;
                const aboutUs = await aboutUsModel.findOne();
                res.render('admin/about-us/aboutUsManagement' , { layout: 'admin/adminLayout', adminInfo, aboutUs });
            } catch (error) {
                next(error);
            }
        },
        // [PUT] / UPDATE GENERAL INTRODUCTION
        async updateGeneralIntroduction(req, res, next) {    
            try {
                const updatedGeneralIntroduction = await aboutUsModel.findByIdAndUpdate({ _id: req.params.id }, { introduction : req.body.generalIntroduction}, { new: true });
                if (updatedGeneralIntroduction) {
                    return res.status(200).json({
                        message: "Updated general introduction successful!", 
                    });
                } else {
                    throw createError.NotFound(`Failed! No records found for general introduction`);
                }
            } catch (error) {
                next(error);
            }
        },
        // [PUT] / UPDATE DEVELOPMENT JOURNEY
        async updateDevelopmentJourney(req, res, next) {    
            try {
                const updatedDevelopmentJourney = await aboutUsModel.findByIdAndUpdate({ _id: req.params.id }, { developmentJourney : req.body.developmentJourney}, { new: true });
                if (updatedDevelopmentJourney) {
                    return res.status(200).json({
                        message: "Updated development journey successful!", 
                    });
                } else {
                    throw createError.NotFound(`Failed! No records found for development journey`);
                }
            } catch (error) {
                next(error);
            }
        },
        // [PUT] / UPDATE MISSION STATEMENT & PURPOSE
        async updateMissionStatementAndPurpose(req, res, next) {    
            try {
                const updatedMissionStatementAndPurpose = await aboutUsModel.findByIdAndUpdate({ _id: req.params.id }, { missionStatementAndPurpose : req.body.missionStatementAndPurpose}, { new: true });
                if (updatedMissionStatementAndPurpose) {
                    return res.status(200).json({
                        message: "Updated mission statement & purpose successful!", 
                    });
                } else {
                    throw createError.NotFound(`Failed! No records found for mission statement & purpose`);
                }
            } catch (error) {
                next(error);
            }
        },
    }
}

module.exports = aboutUsController