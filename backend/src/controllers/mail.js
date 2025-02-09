// mail.js
const send = require("../services/nodemailer");

const sendWelcomeEmail = (to, name, verificationLink) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirmação de E-mail</title>
      </head>
      <body style="margin: 0; display: block; background-color: #fbe2e2">
        <header>
          <div style="background-color: #ffffff; margin: 0 auto; display: block; box-shadow: 0px 4px 4px rgba(0,0,0,0.25); height: fit-content;">
            <img style="width: 20%; height: auto; margin: 0 auto; display: block;" src="cid:petala_logo" alt="Logo da Pétala" />
          </div>
        </header>
        <div style="background-color: #ffffff; margin: 20px auto; width: 50%; border-radius: 32px; padding: 20px;">
          <p style="font-size: 1.2rem; text-align: center;">Olá, ${name}!</p>
          <p style="font-size: 1rem; text-align: justify;">
            Bem-vindo ao Pétala! Estamos muito felizes em tê-lo conosco.
            Para completar seu cadastro, por favor confirme seu e-mail clicando no botão abaixo:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${verificationLink}" style="background-color: #1f1717; color: #fafafa; text-decoration: none; padding: 15px 30px; border-radius: 20px; font-size: 1rem; display: inline-block;">Confirmar E-mail</a>
          </div>
          <p style="font-size: 0.9rem; text-align: center;">
            Se você não se cadastrou no Pétala, ignore este e-mail.
          </p>
        </div>
      </body>
    </html>
  `;
  return send(to, "Confirme seu E-mail - Pétala", html);
};

const sendPasswordResetEmail = (to, name, resetLink) => {
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Redefinição de Senha</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fbe2e2;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 20px;">
              <!-- Cabeçalho com logo -->
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; box-shadow: 0px 4px 4px rgba(0,0,0,0.25);">
                <tr>
                  <td align="center" style="padding: 20px;">
                    <img src="cid:petala_logo" alt="Logo da Pétala" style="display: block; width: 120px; height: auto;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px; font-family: Arial, sans-serif; font-size: 16px; color: #333333;">
                    <p style="text-align: center; font-size: 20px; margin-bottom: 20px;">Olá, ${name}!</p>
                    <p style="text-align: justify;">
                      Recebemos uma solicitação para redefinir sua senha.
                      Se você solicitou essa alteração, clique no botão abaixo para redefinir sua senha.
                      Caso contrário, ignore este e-mail.
                    </p>
                    <!-- Botão em tabela -->
                    <table cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 20px auto;">
                      <tr>
                        <td align="center" bgcolor="#1f1717" style="border-radius: 20px;">
                          <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 15px 30px; font-family: Arial, sans-serif; font-size: 16px; color: #fafafa; text-decoration: none; border-radius: 20px;">
                            Redefinir Senha
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="text-align: center; font-size: 14px; margin-top: 20px; color: #666666;">
                      Esse link expirará em 1 hora.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return send(to, "Redefinição de Senha - Pétala", html);
};

// module.exports = { sendWelcomeEmail, sendPasswordResetEmail };


module.exports = { sendWelcomeEmail, sendPasswordResetEmail };
