const createError = require('http-errors');
const moment = require('moment');

//models
const contactModel = require('../../models/contact');
const announcementModel = require('../../models/announcement');

function homeController() {
    return {
        // [GET] / HOME
        index(req, res) {
            res.status(200).render('site/homePage');
        },
        // [POST] / send contact
        sendContact(req, res) {
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
        // [GET] / ANNOUNCEMENT
        async announcement(req, res, next) {
            const page = req.query.page;
            const options = {
                page: parseInt(page, 10) || 1,
                limit: 4,
                sort: { createdAt: -1 }
            };
            try {
                const announcements = await announcementModel.paginate({ status: "show" }, options);
                return res.render('site/announcement', {
                    announcements: announcements.docs,
                    currentPage: options.page,
                    hasPrevPage: announcements.hasPrevPage,
                    hasNextPage: announcements.hasNextPage,
                    offset: announcements.offset,
                    prev: announcements.prevPage,
                    next: announcements.nextPage,
                    pageTotal: announcements.totalPages,
                });
            } catch (err) {
                next(err);
            }
        },
        
    }
}

module.exports = homeController