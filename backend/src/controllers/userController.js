const db = require("../config/db"); // Importa o db.js, conexão com o DB
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

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
          return res
            .status(400)
            .json({ message: "Nome de usuário já existe." });
        }
      }

      // Gera o token de verificação e a data de expiração
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
          "INSERT INTO users (username, name, email, password_hash, email_verification_token, email_expires) VALUES (?, ?, ?, ?, ?, ?)",
          [username, name, email, hashedPassword, emailToken, emailExpires],
          (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Erro ao cadastrar usuário." });
            }
            res.status(201).json({
              message:
                "Usuário cadastrado com sucesso. Verifique seu email para confirmar",
              username: username,
              verificationCode: emailToken,
            });
          }
        );
      });
    }
  );
};


exports.tokenVerify = (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "O token é obrigatório" });
  }

  
  db.query(
    "SELECT * FROM users WHERE email_verification_token = ? AND email_expires > NOW() ",
    [token],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Erro no servidor" });
      }
      if (result.length === 0) {
        return res.status(400).json({ message: "Token expirado ou inexistente" });
      }

    
      db.query(
        "UPDATE users SET email_verify = true, email_verification_token = NULL, email_expires = NULL WHERE email_verification_token = ?",
        [token],
        (err) => {
          if (err) {
            return res.status(500).json({ message: "Erro ao verificar email" });
          }
          return res.status(200).json({ message: "Email confirmado com sucesso" });
        }
      );
    }
  );
};
