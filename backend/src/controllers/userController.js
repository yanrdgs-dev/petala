const db = require("../config/db"); // Importa o db.js, conexão com o DB
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { sendWelcomeEmail } = require("../services/sendWelcomeEmail");
// TOKEN LOGIN: const jwt = require("jsonwebtoken");

// Função de registro
exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, name, email, password } = req.body;

  // Verifica se o email ou username já existe
  db.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [email, username],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao verificar e-mail." });
      }
      if (result.length > 0) {
        if (result.some((user) => user.email === email)) {
          return res.status(400).json({ message: "E-mail já cadastrado." });
        }
        if (result.some((user) => user.username === username)) {
          return res.status(400).json({ message: "Nome de usuário já existe." });
        }
      }

      // Gera token e data de expiração
      const emailToken = crypto.randomBytes(32).toString("hex");
      const emailExpires = new Date();
      emailExpires.setHours(emailExpires.getHours() + 9);

      // Criptografa a senha
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ message: "Erro ao criptografar senha." });
        }

        // Insere o usuário no banco de dados
        db.query(
          "INSERT INTO users (username, name, email, password_hash, email_verify_token, email_expires) VALUES (?, ?, ?, ?, ?, ?)",
          [username, name, email, hashedPassword, emailToken, emailExpires],
          (err) => {
            if (err) {
              return res.status(500).json({ message: "Erro ao cadastrar usuário." });
            }
            res.status(201).json({
              message: "Usuário cadastrado com sucesso. Verifique seu email para confirmar.",
              username: username,
              verificationCode: emailToken,
            });
          }
        );
      });
    },
    
  );
  sendWelcomeEmail({ name, email }).catch(console.error);
};
