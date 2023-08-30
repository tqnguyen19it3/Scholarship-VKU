const nodemailer = require("nodemailer");
const mailGen = require("mailgen");

const sendPasswordEmail = async (toMail, userName, subject, password, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_ACCOUNT,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        const mailGenerator = new mailGen({
            theme: "cerberus",
            product: {
                name: "VKU",
                logo: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo_tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_th%C3%B4ng_tin_v%C3%A0_Truy%E1%BB%81n_th%C3%B4ng_Vi%E1%BB%87t_-_H%C3%A0n%2C_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_%C4%90%C3%A0_N%E1%BA%B5ng.png",
                link: "http://localhost:5500/"
            },
        });
    
        const emailContent = {
            body: {
                name: userName,
                intro: "You have received this email because a password reset request for your account was received.",
                action: {
                    instructions: 'Your new password has been updated below <br><span style="font-size: 32px;">&#128071;</span>',
                    button: {
                        color: '#22BC66',
                        text: password,
                    }
                },
                outro: "If you didn't ask to reset your password, ignore this email",
            },
        };
    
        const mailOptions = {
            from: "noreply@vku.udn.vn",
            to: toMail,
            subject: subject,
            text: password,
            html: mailGenerator.generate(emailContent),
        };
    
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Failed to send email");
    }
};

const sendPasswordEmailAddMember = async (toMail, userName, subject, password, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_ACCOUNT,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        const mailGenerator = new mailGen({
            theme: "cerberus",
            product: {
                name: "VKU",
                logo: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo_tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_th%C3%B4ng_tin_v%C3%A0_Truy%E1%BB%81n_th%C3%B4ng_Vi%E1%BB%87t_-_H%C3%A0n%2C_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_%C4%90%C3%A0_N%E1%BA%B5ng.png",
                link: "http://localhost:5500/"
            },
        });
    
        const emailContent = {
            body: {
                name: userName,
                intro: "You received this email because your account has been allocated by our system.",
                action: {
                    instructions: 'Use your email and password below to join us <br><span style="font-size: 32px;">&#128071;</span>',
                    button: {
                        color: '#22BC66',
                        text: password,
                    }
                },
                outro: "If you are not interested, please ignore this email",
            },
        };
    
        const mailOptions = {
            from: "noreply@vku.udn.vn",
            to: toMail,
            subject: subject,
            text: html,
            html: mailGenerator.generate(emailContent),
        };
    
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Failed to send email");
    }
};

const sendEmailCandidateSubmitForm = async (candidate, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_ACCOUNT,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        const mailGenerator = new mailGen({
            theme: "cerberus",
            product: {
                name: "VKU",
                logo: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Logo_tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_C%C3%B4ng_ngh%E1%BB%87_th%C3%B4ng_tin_v%C3%A0_Truy%E1%BB%81n_th%C3%B4ng_Vi%E1%BB%87t_-_H%C3%A0n%2C_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_%C4%90%C3%A0_N%E1%BA%B5ng.png",
                link: "http://localhost:5500/"
            },
        });
    
        const emailContent = {
            body: {
                name: candidate.name,
                intro: "Congratulations on your successful application, we will review and approve your application. Please wait for the earliest notification from us",
                table: {
                    data: [
                        {
                            key: 'Name',
                            value: candidate.name
                        },
                        {
                            key: 'Email',
                            value: candidate.email
                        },
                        {
                            key: 'Phone Number',
                            value: candidate.phoneNumber
                        },
                        {
                            key: 'Date of Birth',
                            value: candidate.dob
                        },
                        {
                            key: 'Gender',
                            value: candidate.gender
                        },
                        {
                            key: 'More Info',
                            value: candidate.moreInfo
                        }
                    ]
                },
                outro: "If you have not submitted any request before, please ignore this email",
            },
        };
    
        const mailOptions = {
            from: "noreply@vku.udn.vn",
            to: candidate.email,
            subject: subject,
            text: html,
            html: mailGenerator.generate(emailContent),
        };
    
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error("Failed to send email");
    }
};

module.exports = { 
    sendPasswordEmail,
    sendPasswordEmailAddMember,
    sendEmailCandidateSubmitForm 
}