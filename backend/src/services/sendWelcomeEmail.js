const sendEmail = require("../utils/mailer");
const path = require("path");

async function sendWelcomeEmail(user) {
  const variables = {
    name: user.name,
    petala_logo: "cid:logo_petala_image",
  };

  await sendEmail(
    user.email,
    "Bem vindo ao Pétala!",
    "../../frontend/templates/email_boas-vindas.html",
    variables,
    [
      {
        filename: "petala_logo.png",
        path: path.resolve(
          __dirname,
          "frontend",
          "assets",
          "images",
          "petala_logo.png"
        ),
        cid: "logo_petala_image",
      },
    ]
  );
}

module.exports = { sendWelcomeEmail };
