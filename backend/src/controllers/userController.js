const { validationResult } = require("express-validator"); // Adicione essa linha
const db = require("../config/db"); // Importa o db.js, conexão com o DB
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendWelcomeEmail } = require("../services/sendWelcomeEmail");

exports.register = (req, res) => {
  const errors = validationResult(req); 
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, name, email, password } = req.body;

  const confirmationToken = crypto.randomBytes(20).toString("hex");

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
          return res
            .status(400)
            .json({ message: "Nome de usuário já existe." });
        }
      }
      // Criptografar senha
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Erro ao criptografar senha." });
        }

        db.query(
          "INSERT INTO users (username, name, email, password_hash, confirmation_token) VALUES (?, ?, ?, ?, ?)",
          [username, name, email, hashedPassword, confirmationToken],
          (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Erro ao cadastrar usuário." });
            }
            res.status(201).json({
              message: "Usuário cadastrado com sucesso.",
              username: username,
            });
          }
        );
      });
    }
  );
  sendWelcomeEmail({ name, email, token: confirmationToken }).catch(console.error);
};