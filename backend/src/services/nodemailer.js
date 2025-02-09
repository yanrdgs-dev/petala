require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    secure: process.env.MAIL_PORT == 465 
});

const send = (to, subject, body) => {
    return transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: to,
        subject: subject,
        html: body
    }).then(info => {
        console.log("Email enviado: ", info.response);
    }).catch(error => {
        console.error("Erro ao enviar email: ", error);
        throw error;
    });
};

module.exports = send;
