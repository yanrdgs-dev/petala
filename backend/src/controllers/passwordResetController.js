// passwordReset.js
const db = require("../config/db");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { sendPasswordResetEmail } = require("../controllers/mail"); // ajuste o caminho conforme sua estrutura

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Erro ao verificar e-mail." });

    if (result.length === 0)
      return res.status(404).json({ message: "E-mail não cadastrado." });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    db.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, tokenExpiry, email],
      (err) => {
        if (err)
          return res.status(500).json({ message: "Erro ao salvar token." });

        // Construa o link para reset de senha; ajuste o domínio conforme seu frontend
        const resetLink = `http://localhost:3000/reset?token=${token}`;
        // Envia o e-mail de redefinição de senha
        sendPasswordResetEmail(email, result[0].name, resetLink)
          .then(() => {
            return res
              .status(200)
              .json({ message: "E-mail para redefinição enviado com sucesso!" });
          })
          .catch((error) => {
            return res.status(500).json({
              message: "Erro ao enviar e-mail de redefinição.",
              error: error.message,
            });
          });
      }
    );
  });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  db.query("SELECT * FROM users WHERE reset_token = ?", [token], (err, result) => {
    if (err) {
      console.log("Erro ao verificar token: ", err);
      return res.status(500).json({ message: "Erro ao verificar token." });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "Token inválido ou expirado." });
    }

    const user = result[0];
    // Verifica se o token ainda é válido
    if (new Date(user.reset_token_expiry) < new Date()) {
      return res
        .status(400)
        .json({ message: "Token expirado. Por favor, solicite um novo token." });
    }

    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        console.log("Erro ao criptografar senha: ", err);
        return res
          .status(500)
          .json({ message: "Erro ao criptografar nova senha." });
      }

      db.query(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        [hashedPassword, user.id],
        (err) => {
          if (err) {
            console.log("Erro ao atualizar senha: ", err);
            return res
              .status(500)
              .json({ message: "Erro ao atualizar senha." });
          }

          db.query(
            "UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
            [user.id],
            (err) => {
              if (err) {
                console.log("Erro ao limpar token: ", err);
                return res
                  .status(500)
                  .json({ message: "Erro ao limpar token." });
              }

              return res
                .status(200)
                .json({ message: "Senha redefinida com sucesso!" });
            }
          );
        }
      );
    });
  });
};
