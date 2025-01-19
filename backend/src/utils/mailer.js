const fs = require("fs");
const path = require("path");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
require("dotenv").config(); // variaveis de ambiente
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const mime = require("mime-types");

async function sendEmail(to, subject, templatePath, variables = {}) {
  try {
    const templateFile = path.resolve(__dirname, "..", templatePath);

    let htmlContent = fs.readFileSync(templateFile, "utf8");

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(regex, value);
    }

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: "Pétala <no-reply@petala.net>",
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email enviado: ${response.id}`);
  } catch (error) {
    console.error("Erro ao enviar email: ", error);
    throw error;
  }
}

module.exports = sendEmail;
