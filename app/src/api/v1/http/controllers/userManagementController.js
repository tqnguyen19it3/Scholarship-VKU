const createError = require('http-errors');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { generateRandomPassword } = require('../../helpers/generate_password');
const { sendPasswordEmailAddMember } = require('../../../../services/sendMail.service');

//models
const userModel = require('../../models/user');

function userManagementController() {
    return {
        // [GET] / ADD MEMBER
        async addMember(req, res, next) {
            try {
                const adminInfo = req.payload;
                res.render('admin/user-management/addMember' , { layout: 'admin/adminLayout', adminInfo });
            } catch (error) {
                next(error);
            }
        },
        // [POST] / SAVE MEMBER
        async saveMember(req, res, next) {
            try {
                const { name, email, role } = req.body;

                if(!email || !name || !role) return res.cookie('adminErrorMessage', 'Fields are required').redirect('/api/admin/add-member');

                // check email exits
                const existingUser = await userModel.findOne({ email });
                if (existingUser) {
                    return res.cookie('adminErrorMessage', `Create Member Failed! ${email} already exists`).redirect('/api/admin/add-member');
                }

                 // create new password
                const password  = await generateRandomPassword();
                const hashedPassword = await bcrypt.hashSync(password, 10);

                // store 1 user in mongodb
                const user = await userModel.create({
                    name,
                    email,
                    password: hashedPassword,
                    role
                });

                await sendPasswordEmailAddMember(
                    email,
                    user.name,
                    "Distributing account",
                    password,
                    `<p>Your email is: ${user.name}</p><p>Your password is: ${password}</p>`
                );

                return res.cookie('adminSuccessMessage', 'Create Member Successfully!').redirect('/api/admin/add-member');

            } catch (error) {
                next(error);
            }
        },
        // [GET] / FUND MANAGEMENT
        async fundManagement(req, res, next) {
            try {
                const adminInfo = req.payload;
                const fundManagement = await userModel.find({ role: "Fund Management Board" }).sort({ createdAt: -1 });
                res.render('admin/user-management/fundManagement' , { layout: 'admin/adminLayout', adminInfo, fundManagement });
            } catch (error) {
                next(error);
            }
        },
        // [GET] / SPONSOR MANAGEMENT
        async sponsorManagement(req, res, next) {
            try {
                const adminInfo = req.payload;
                const sponsorManagement = await userModel.find({ role: "Sponsor" }).sort({ createdAt: -1 });
                res.render('admin/user-management/sponsorManagement' , { layout: 'admin/adminLayout', adminInfo, sponsorManagement });
            } catch (error) {
                next(error);
            }
        },

    }
}

module.exports = userManagementController