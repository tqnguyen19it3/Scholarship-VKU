const bcrypt = require('bcrypt');
const createError = require('http-errors');
const axios = require('axios');
const { userRegisterValidate, userLoginValidate, userResetPasswordValidate} = require('../../validations/validation');
const { generateRandomPassword } = require('../../helpers/generate_password');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../../../services/jwt.service');
const { sendPasswordEmail } = require('../../../../services/sendMail.service');
const redisClient = require('../../../../config/redis');

//models
const userModel = require('../../models/user');

function authController() {

    return {
        // [POST] / register
        async register(req, res, next) {
            try {
                const { name, email, password } = req.body;
                // validate all fields
                const { error } = userRegisterValidate(req.body);
                if(error){
                    throw createError(error.details[0].message);
                }
                // check email exits
                const existingUser = await userModel.findOne({ email });
                if (existingUser) {
                    throw createError.Conflict(`Register Failed! ${email} already exists`);
                }
                // store 1 user in mongodb
                const user = await userModel.create({
                    name,
                    email,
                    password: bcrypt.hashSync(password, 10)
                });
                
                return res.status(200).json({
                    message: "Register Successfully!",
                    user
                });

            } catch (error) {
                next(error);
            }
        },
        // [POST] / login
        async login(req, res, next) {
            try {
                
                const { email, password } = req.body;
                // validate all fields
                const { error } = userLoginValidate(req.body);
                if(error){
                    throw createError(error.details[0].message);
                }
                //check user exits
                const user = await userModel.findOne({ email });
                if(!user){
                    throw createError.NotFound(`Login Failed! ${email} not registered`);
                }
                //check password
                const isPassValid = bcrypt.compareSync(password, user.password);
                if(!isPassValid){
                    throw createError.Unauthorized("Login Failed! Invalid password");
                }
                // create jwt when login success
                const payload = {
                    _id: user._id,
                    name: user.name,
                    role: user.role,
                    email: user.email
                }

                const accessTokenUser = await signAccessToken(payload);
                const refreshTokenUser = await signRefreshToken(payload);

                res.cookie('accessToken', accessTokenUser, { maxAge: process.env.ACCESS_EXPIRED_IN * 1000 });
                res.cookie('refreshToken', refreshTokenUser, { maxAge: process.env.REFRESH_EXPIRED_IN * 1000 });

                return res.redirect('/');
            } catch (error) {
                next(error);
            }
        },
        // [POST] / refresh token
        async refreshToken(req, res, next) {
            try {
                const { refreshToken } = req.body;

                if(!refreshToken) throw createError.BadRequest();

                const { _id, name, role, email } = await verifyRefreshToken(refreshToken);

                const accessTokenUser = await signAccessToken({ _id, name, role, email });
                const refreshTokenUser = await signRefreshToken({ _id, name, role, email });

                res.status(200).json({ 
                    message: "Refresh Token successfully!",
                    accessTokenUser,
                    refreshTokenUser
                });
            } catch (error) {
                next(error);
            }
        },
        // [POST] / login google
        authGoogle(req, res, next) {
            if(req.body.access_token){
                axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
                    headers: {
                        "Authorization": `Bearer ${req.body.access_token}`
                    }
                }).then(async response => {
                    const { email, given_name, family_name, picture, sub } = response.data;
                    const name = `${(family_name.trim() || "")} ${(given_name.trim() || "")}`;

                    // check email exits
                    let user = await userModel.findOne({  $or: [{ email }, { googleId: sub }] });
                    if (user) {
                        // Update user info
                        user.name = name;
                        user.googleId = sub;
                        await user.save();
                    }else {
                        // store 1 user in mongodb
                        user = await userModel.create({
                            name,
                            email,
                            googleId: sub
                        });
                    }
                     // create jwt when login success
                    const payload = {
                        _id: user._id,
                        name: user.name,
                        role: user.role,
                        email: user.email
                    }
                    const accessTokenUser = await signAccessToken(payload);
                    const refreshTokenUser = await signRefreshToken(payload);
                    return res.status(200).json({
                        message: "Login google successfully!", 
                        accessToken: accessTokenUser,
                        refreshToken: refreshTokenUser
                    });
                }).catch(err => next(err));
            }else{
                return next(createError.BadRequest("Access token is required"));
            }
        },
        // [DELETE] / logout
        async logout(req, res, next) {
            try {
                const refreshToken = req.cookies.refreshToken;
                if(!refreshToken){
                    throw createError.BadRequest();
                } 
                const { _id } = await verifyRefreshToken(refreshToken);
                redisClient.del(_id, (err, reply) => {
                    if(err){
                        throw createError.InternalServerError();
                    }
                    // Xóa accessToken + refreshToken khỏi cookie
                    res.clearCookie('accessToken');
                    res.clearCookie('refreshToken');
                    
                    res.redirect('/');
                });
            } catch (error) {
                next(error);
            }
        },
        // [POST] / get password when forget
        async forgotPassword(req, res, next){
            try {
                const { email } = req.body;
                if(!email) throw createError.Conflict(`Thất bại! Trường email là bắt buộc`);
                //check user exits
                const user = await userModel.findOne({ email });
                if(!user){
                    throw createError.NotFound(`Thất bại! Tài khoản ${email} chưa được đăng ký`);
                }
                // create new password
                const password  = await generateRandomPassword();
                const hashedPassword = await bcrypt.hashSync(password, 10);
                // update new password in db
                await userModel.updateOne({ email: email }, { password: hashedPassword });

                await sendPasswordEmail(
                    email,
                    user.name,
                    "Reset Your Password",
                    password,
                    `<p>Your password is: ${password}</p>`
                );

                return res.status(200).json({
                    message: "Yêu cầu đặt lại mật khẩu thành công! Vui lòng kiểm tra email của bạn",
                });
                
            } catch (error) {
                next(error);
            }
        },
        // [POST] / reset password
        async resetPassword(req, res, next){
            try {
                if(!req.body){
                    return res.status(401).json({
                        message: "Có gì đó không ổn!", 
                    });
                }
                const { oldPassword, newPassword } = req.body;
                // validate all fields
                const { error } = userResetPasswordValidate({ newPassword });
                if(error){
                    throw createError(error.details[0].message);
                }
                // check user exits
                const user = await userModel.findById(req.payload._id);
                if (!user) {
                    return res.status(404).json({
                        message: "Không tìm thấy người dùng này!", 
                    });
                }

                //check password
                const isPassValid = await bcrypt.compareSync(oldPassword, user.password);
                if(!isPassValid){
                    throw createError.Unauthorized("Mật khẩu cũ không hợp lệ");
                }

                const hashedPassword = await bcrypt.hashSync(newPassword, 10)
                user.password = hashedPassword;
                await user.save();

                return res.status(200).json({
                    message: "Đặt lại mật khẩu thành công!", 
                });

            } catch (error) {
                next(error);
            }
        }
    }
}

module.exports = authController