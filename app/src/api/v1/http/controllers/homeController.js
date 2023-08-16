//models
const contactModel = require('../../models/contact');

function homeController() {
    return {
        // [GET] / HOME
        index(req, res) {
            res.status(200).render('site/homePage');
        },
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
    }
}

module.exports = homeController