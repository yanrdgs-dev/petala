const db = require("../config/db"); // Importa o db.js, conexão com o DB
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  //Verifica se o email já existe
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao verificar e-mail." });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: "E-mail já cadastrado. " });
    }

    // Criptografar senha
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao criptografar senha." });
      }

      // Inserir usuário no banco de dados
      db.query(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Erro ao cadastrar usuário." });
          }
          res.status(201).json({ message: "Usuário cadastrado com sucesso." });
        },
      );
    });
  });
};
