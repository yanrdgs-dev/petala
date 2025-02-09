const db = require("../config/db");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { sendWelcomeEmail } = require("../controllers/mail");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, name, email, password } = req.body;

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

            res.status(201).json({
              message: "Usuário cadastrado com sucesso.",
              username: username,
              token: token,
            });

       
            const verificationToken = jwt.sign(
              { id: insertResult.insertId, email },
              process.env.JWT_SECRET,
              { expiresIn: '1h' } 
            );
            
            const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
            sendWelcomeEmail(email, name, verificationLink);
            
          }
        );
      });
    }
  );
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
//     sendWelcomeEmail({ name, email }).catch(console.error)
// };
