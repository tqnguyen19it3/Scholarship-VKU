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
                const userInfo = req.payload;
                res.render('admin/user-management/addMember' , { layout: 'admin/adminLayout', userInfo });
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
                const existingUserDeleted = await userModel.findOneDeleted({ email });
                const existingUser = await userModel.findOne({ email });

                if (existingUser || existingUserDeleted) {
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
        // [DELETE] / SOFT DELETE MEMBER
        softDelMember(req, res, next) {
            userModel.delete({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Move user to the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [PATCH] / RESTORE MEMBER FROM TRASH
        restoreMember(req, res, next) {
            userModel.restore({ _id: req.params.id })
            .then(() => {
                res.status(200).json({
                    message: 'Restore user from the trash successfully!'
                });
            })
            .catch(err => {
                next(err);
            });
        },
        // [DELETE] / DESTROY MEMBER FROM TRASH
        destroyMember(req, res, next) {
            userModel.findOneAndDelete({ _id: req.params.id })
            .then((item) => {
                res.status(200).json({
                    message: 'Permanently delete this user successfully!'
                });
            })
            .catch(err => {
                next(err);
            })
        },
        // [GET] / FUND MANAGEMENT BOARD
        async fundManagementBoard(req, res, next) {
            try {
                const userInfo = req.payload;
                const fundManagementBoard = await userModel.find({ role: "Fund Management Board" }).sort({ createdAt: -1 });
                const fundManagementBoardDeletedCount = await userModel.countDocumentsDeleted({ role: "Fund Management Board" });
                res.render('admin/user-management/fund/fundManagementBoard' , { layout: 'admin/adminLayout', userInfo, fundManagementBoard, fundManagementBoardDeletedCount, moment });
            } catch (error) {
                next(error);
            }
        },
        // [GET] / TRASH FUND MANAGEMENT BOARD PAGE
        async trashFundManagementBoard(req, res, next) {
            try {
                const userInfo = req.payload;
                const deletedUser = await userModel.findDeleted({ role: "Fund Management Board" });
                return res.render('admin/user-management/fund/trashFundManagementBoard', { layout: 'admin/adminLayout', deletedUser, userInfo, moment });
            } catch (error) {
                next(error);
            }
        },
        // [GET] / SPONSORSHIP MANAGEMENT
        async sponsorshipManagement(req, res, next) {
            try {
                const userInfo = req.payload;
                const sponsorshipManagement = await userModel.find({ role: "Sponsor" }).sort({ createdAt: -1 });
                const sponsorshipManagementDeletedCount = await userModel.countDocumentsDeleted({ role: "Sponsor" });
                res.render('admin/user-management/sponsor/sponsorshipManagement' , { layout: 'admin/adminLayout', userInfo, sponsorshipManagement, sponsorshipManagementDeletedCount, moment });
            } catch (error) {
                next(error);
            }
        },
        // [GET] / TRASH SPONSORSHIP MANAGEMENT PAGE
        async trashSponsorshipManagement(req, res, next) {
            try {
                const userInfo = req.payload;
                const deletedUser = await userModel.findDeleted({ role: "Sponsor" });
                return res.render('admin/user-management/sponsor/trashSponsorshipManagement', { layout: 'admin/adminLayout', deletedUser, userInfo, moment });
            } catch (error) {
                next(error);
            }
        },

    }
}

module.exports = userManagementController