const nodemailer = require('nodemailer');
require("dotenv").config();
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

async function sendEmail(subject, message) {
    const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: process.env.SMTP_EMAIL_TO,
        subject,
        text: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return info;
    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
}

module.exports = sendEmail;