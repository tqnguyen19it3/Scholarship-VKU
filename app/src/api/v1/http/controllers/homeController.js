const createError = require('http-errors');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { sendEmailCandidateSubmitForm } = require('../../../../services/sendMail.service');

//models
const contactModel = require('../../models/contact');
const announcementModel = require('../../models/announcement');
const scholarshipModel = require('../../models/scholarship');
const aboutUsModel = require('../../models/about_us');
const CSI_infoModel = require('../../models/CSI_info');
const funFactModel = require('../../models/funFact');
const faqModel = require('../../models/faq');
const userModel = require('../../models/user');
const candidateModel = require('../../models/candidate');

function homeController() {
    return {
        // [GET] / HOME
        async index(req, res, next) {
            try {
                const FMB = await userModel.find({ role: "Fund Management Board" }).limit(6);
                const sponsors = await userModel.find({ role: "Sponsor" });
                const aboutUs = await aboutUsModel.findOne();
                const CSI = await CSI_infoModel.findOne();
                const faqs = await faqModel.find({ status: "show" }).limit(4);
                const funFacts = await funFactModel.find({ status: "show" }).limit(4);
                res.status(200).render('site/homePage', { FMB, sponsors, aboutUs, CSI, faqs, funFacts });
            } catch (error) {
                next(error);
            }
            
        },
        // [POST] / send contact
        sendContact(req, res, next) {
            const contactInfo = new contactModel({
                name: req.body.name,
                email: req.body.email,
                message: req.body.message
            });

            contactInfo.save()
                .then((response) => {
                    return res.cookie('successMessage', 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi đến bạn sớm nhất có thể').redirect('back');
                })
                .catch(err => {
                    return res.cookie('errorMessage', 'Đã xảy ra lỗi trong lúc bạn gửi yêu cầu. Hãy thử lại sau').redirect('back');
                });
        },
        // [GET] / ANNOUNCEMENTS
        async announcements(req, res, next) {
            const page = req.query.page;
            const options = {
                page: parseInt(page, 10) || 1,
                limit: 4,
                sort: { createdAt: -1 }
            };
            try {
                const CSI = await CSI_infoModel.findOne();
                const announcements = await announcementModel.paginate({ status: "show" }, options);
                if(announcements){
                    return res.render('site/announcements', {
                        CSI,
                        announcements: announcements.docs,
                        currentPage: options.page,
                        hasPrevPage: announcements.hasPrevPage,
                        hasNextPage: announcements.hasNextPage,
                        offset: announcements.offset,
                        prev: announcements.prevPage,
                        next: announcements.nextPage,
                        pageTotal: announcements.totalPages,
                        moment
                    });
                } else {
                    throw createError.NotFound(`Thất bại! Không thể tìm thấy trang này`);
                }
               
            } catch (err) {
                next(err);
            }
        },
        // [GET] / ANNOUNCEMENT DETAIL PAGE
        async announcementDetail(req, res, next) {
            try {
                const CSI = await CSI_infoModel.findOne();
                const announcementDetail = await announcementModel.findOne({ _id: req.params.id, status: "show" });
                if(announcementDetail){
                    res.render('site/announcementDetail', { announcementDetail, moment, CSI });
                } else {
                    throw createError.NotFound(`Thất bại! Không thể tìm thấy trang này`);
                }
            } catch (err) {
                next(err);
            }
        },
         // [GET] / SCHOLARSHIPS
         async scholarships(req, res, next) {
            const page = req.query.page;
            const options = {
                page: parseInt(page, 10) || 1,
                limit: 100,
                sort: { start_deadline: 1 }
            };
            try {
                const CSI = await CSI_infoModel.findOne();
                const scholarships = await scholarshipModel.paginate({ status: "show" }, options);

                if(scholarships){
                    return res.render('site/scholarships', {
                        CSI,
                        scholarships: scholarships.docs,
                        currentPage: options.page,
                        hasPrevPage: scholarships.hasPrevPage,
                        hasNextPage: scholarships.hasNextPage,
                        offset: scholarships.offset,
                        prev: scholarships.prevPage,
                        next: scholarships.nextPage,
                        pageTotal: scholarships.totalPages,
                        moment
                    });
                } else {
                    throw createError.NotFound(`Thất bại! Không thể tìm thấy trang này`);
                }
 
            } catch (err) {
                next(err);
            }
        },
        // [GET] / SCHOLARSHIP DETAIL PAGE
        async scholarshipDetail(req, res, next) {
            try {
                const CSI = await CSI_infoModel.findOne();
                const scholarshipDetail = await scholarshipModel.findOne({ _id: req.params.id, status: "show" });
                if(scholarshipDetail){
                    res.render('site/scholarshipDetail', { scholarshipDetail, moment, CSI });
                } else {
                    throw createError.NotFound(`Thất bại! Không thể tìm thấy trang này`);
                }
            } catch (err) {
                next(err);
            }
        },
        // [GET] / APPLICATION FORM PAGE
        async applicationForm(req, res, next) {
            try {
                const CSI = await CSI_infoModel.findOne();
                const scholarship = await scholarshipModel.findOne({ _id: req.params.id, status: "show" });
                if(scholarship){
                    if(scholarship.end_deadline < new Date()){
                        throw createError.NotFound(`Thất bại! Không thể tìm thấy trang này`);
                    }
                    if(scholarship.total < 1){
                        throw createError.NotFound(`Thất bại! Không thể tìm thấy trang này`);
                    }
                    res.render('site/applicationForm', { scholarship, moment, CSI });
                } else {
                    throw createError.NotFound(`Thất bại! Không thể tìm thấy trang này`);
                }
            } catch (err) {
                next(err);
            }
        },
        // [POST] / ADD CANDIDATE
        async submitCandidateProfile(req, res, next) {
            try {
                // check scholar exits
                const existingScholarship = await scholarshipModel.findById(req.params.id);
                if(!existingScholarship){
                    return res.cookie('errorMessage', `Chúng tôi không thể xử lý yêu cầu của bạn vì học bổng này không tồn tại`).redirect('back');
                }

                const infoCandidate = { 
                    scholarshipId: existingScholarship._id,
                    name: req.body.name,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    moreInfo: req.body.moreInfo,
                    avatar: req.files['avatar'][0].filename,
                    document: req.files['document'][0].filename
                }

                // check email exits
                const existingCandidate = await candidateModel.findOne({ email: infoCandidate.email, scholarshipId: infoCandidate.scholarshipId});
                const existingCandidateDeleted = await candidateModel.findOneDeleted({ email: infoCandidate.email, scholarshipId: infoCandidate.scholarshipId});

                if (existingCandidate || existingCandidateDeleted) {
                    return res.cookie('errorMessage', `Hình như bạn đã nộp hồ sơ cho học bổng này rồi, bạn không thể nộp nhiều hồ sơ cho cùng loại học bổng`).redirect('back');
                }

                // // store 1 candidate in mongodb
                const candidate = await candidateModel.create(infoCandidate);

                // send mail to candidate 
                await sendEmailCandidateSubmitForm(
                    candidate,
                    "Application Confirmation",
                    `<p>Notice of successful submission!</p>`
                );

                return res.cookie('successMessage', 'Nộp hồ sơ thành công, hãy kiểm tra lại email của bạn!').redirect('back');

            } catch (error) {
                next(error)
            }
        },
        
    }
}

module.exports = homeController