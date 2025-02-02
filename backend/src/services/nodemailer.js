require('dotenv').config();
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    },
    // secure:false
})


const send = (to,subject,body) =>{
    transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject,
        html: body
    })
}

module.exports = send;