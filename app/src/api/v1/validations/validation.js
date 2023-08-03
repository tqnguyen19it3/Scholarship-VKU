const Joi = require('joi');

const userRegisterValidate = (data) => {
    const userSchema = Joi.object({
        name: Joi.string().min(6).max(24).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string()
    });
    return userSchema.validate(data);
};

const userLoginValidate = (data) => {
    const userSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    return userSchema.validate(data);
}

const userResetPasswordValidate = (data) => {
    const userSchema = Joi.object({
        newPassword: Joi.string().min(6).required(),
    });
    return userSchema.validate(data);
}

module.exports = {
    userRegisterValidate,
    userLoginValidate,
    userResetPasswordValidate
}