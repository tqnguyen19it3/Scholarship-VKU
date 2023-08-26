const createError = require('http-errors');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const { signAccessToken } = require('../../../../services/jwt.service');

//models
const userModel = require('../../models/user');

function memberController() {
    return {
        // [GET]
        async memberProfile(req, res, next) {
            try{
                const userId = req.params.id;
                const user = await userModel.findById(userId);

                if (!user) {
                    throw createError.NotFound(`Failed! Không tìm thấy hồ sơ người dùng này`);
                }

                if(user._id.toString() !== req.payload._id){
                    throw createError.Forbidden(`Failed! Bạn không có quyền truy cập vào hồ của sơ người dùng này`);
                }

                return res.render('member/profile' , { layout: 'member/memberLayout', user });

            } catch (error) {
                next(error);
            }
        },
        // [PUT] / UPDATE INFO MEMBER
        updateInfoMember(req, res, next) {
            const infoMember = { 
                name: req.body.name,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                dob: req.body.dob,
                gender: req.body.gender,
                address: req.body.address,
                company: req.body.company
            }
            if(req.file){
                userModel.findById(req.params.id)
                    .then(item => {
                        if(item.avatar){
                            // Delete old image file exist
                            fs.unlink(path.join(__dirname, '../../../../public/uploads/member/avatar/' + item.avatar), (err) => {
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

                    infoMember.avatar = req.file.filename;
            }
            userModel.findOneAndUpdate({ _id: req.params.id }, infoMember, { new: true })
                .then(async (user) => {
                     // update jwt when update info success
                     const payload = {
                        _id: user._id,
                        name: user.name,
                        role: user.role,
                        email: user.email,
                        avatar: user.avatar
                    }
                    const accessTokenUser = await signAccessToken(payload);
                    res.cookie('accessToken', accessTokenUser, { maxAge: process.env.ACCESS_EXPIRED_IN * 1000 });
                    return res.cookie('memberSuccessMessage', 'Update information successfully!').redirect(`/api/member/profile/${req.params.id}`);
                })
                .catch(err => {
                    return res.cookie('memberErrorMessage', 'Something went wrong!').redirect(`/api/member/profile/${req.params.id}`);
                });
        },
    }
}

module.exports = memberController;