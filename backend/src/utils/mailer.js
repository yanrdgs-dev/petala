const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config(); // variaveis de ambiente

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, templatePath, variables = {}) {
  try {
    const templateFile = path.resolve(__dirname, "..", templatePath);

    let htmlContent = fs.readFileSync(templateFile, "utf8");

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(regex, value);
    }

    const send = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });

    console.log(`Email enviado: ${send.messageId}`);
  } catch (error) {
    console.error("Erro ao enviar email: ", error);
    throw error;
  }
}

module.exports = sendEmail;
