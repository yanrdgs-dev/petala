const db = require("../config/db");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { sendWelcomeEmail } = require("../services/sendWelcomeEmail");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { error } = require("console");

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, name, email, password } = req.body;

  //Verifica se o email já existe
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
          (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Erro ao cadastrar usuário." });
            }
            const token = jwt.sign(
              { id: result.insertId, email, username },
              process.env.JWT_SECRET,
              {
                expiresIn: "24h",
              },
            );
            res.status(201).json({
              message: "Usuário cadastrado com sucesso.",
              username: username,
              token: token,
            });
          },
        );
      });
    },
  );
  sendWelcomeEmail({ name, email }).catch(console.error);
  // Criando a vericação no email:

  db.query(
    "INSERT INTO users (username, name, email, password_hash, email_verification_token,  email_expires) VALUES (?,?,?,?,?,?)",
    [username, name, email, hashedPassword, emailToken, emailExpires],
    err,
  ),
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao cadastrar usuário" });
      }
      res.status(200).json({
        message:
          "Usuário cadastrado com sucesso! Veifique seu email para validar.",
        verificationToken: emailToken,
      });
    };
};

// FIM DO ESCOPO DO REGISTER

const emailToken = crypto.randomBytes(32).toString("hex");
const emailExpires = new Date();
emailExpires.setHours(emailExpires.getHours() + 9);

exports.tokenVerify = () => {
  const { token } = req.query;

  if (!token) {
    res.status(400).json({ message: "O token é obrigatório" });
  }

  db.query(
    "SELECT * FROM users WHERE email_verification_token = ? AND email_expires > NOW()",
    [token],
  ),
    (err) => {
      if (err) {
        res.status(40).json({ message: "Erro no servidor" });
      }
    };
  if (token.length == 0) {
    res.status(400).json({ message: "Token expirado ou inexistente" });
  }
};

// db.query(
//   "SELECT * FROM users WHERE email_verification_token = ? AND email_expires > NOW()",
//   [token],
//   err
// ),
//   (err) => {
//     if (err) {
//       res.status(400).json({ message: "Erro no servidor" });
//     }

//     if (token.length === 0) {
//       res.status(400).json({ message: "Token inexistente ou expirado" });
//     }
//   };
// db.query(
//   "UPDATE users SET email_verify = true, email_verification_token = NULL, email_expires = NULL WHERE email_verification_token = ?",
//   [token],
//   err
// ),
//   (err) => {
//     if (err) {
//       res
//         .status(500)
//         .json({ message: "Não foi possível verificar seu email" });
//     }
//     if (!err) {
//       res.status(200).json({ message: "Email veificado com sucesso!" });
//     }
//     sendWelcomeEmail({ name, email }).catch(console.error);
// };
