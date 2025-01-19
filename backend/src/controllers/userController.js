const db = require("../config/db");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { sendWelcomeEmail } = require("../services/sendWelcomeEmail");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, name, email, password } = req.body;

  // Verifica se o e-mail ou username já existe
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

        // Inserir usuário no banco de dados
        db.query(
          "INSERT INTO users (username, name, email, password_hash) VALUES (?, ?, ?, ?)",
          [username, name, email, hashedPassword],
          (err, insertResult) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Erro ao cadastrar usuário." });
            }

            // Gerar token JWT
            const token = jwt.sign(
              { id: insertResult.insertId, email, username },
              process.env.JWT_SECRET,
              {
                expiresIn: "24h",
              }
            );

            // Retornar resposta com sucesso
            res.status(201).json({
              message: "Usuário cadastrado com sucesso.",
              username: username,
              token: token,
            });

            // (Opcional) Enviar e-mail de boas-vindas
            sendWelcomeEmail(email, name);
          }
        );
      });
    }
  );
};
