const sendEmail = require("../utils/mailer");

async function sendWelcomeEmail(user) {
  const variables = {
    name: user.name,
  };

  await sendEmail(
    user.email,
    "Bem vindo ao Pétala!",
    "../../frontend/templates/email_boas-vindas.html",
    variables,
  );
}

module.exports = { sendWelcomeEmail };
