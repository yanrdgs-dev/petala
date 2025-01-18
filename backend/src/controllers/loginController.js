const db = require("../config/db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "E-mail e senha são obrigatórios." });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).send({ message: "Erro no servidor" });
    }
    if (result.length == 0) {
      return res.status(400).send({ message: "E-mail ou senha incorretos." });
    }

    const usuario = result[0];

    bcrypt.compare(password, usuario.password_hash, (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao verificar sua senha." });
      }
      if (!isMatch) {
        return res.status(400).json({ message: "E-mail ou senha incorretos." });
      }

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, username: usuario.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        },
      );

      res.status(200).json({ message: "Login efetuado com sucesso.", token });
    });
  });
};
