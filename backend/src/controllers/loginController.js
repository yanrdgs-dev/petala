const db = require("../config/db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// cnsole.log("JWT_SECRET:", process.env.JWT_SECRET);

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

    // if (!usuario.is_verified) {
    //   return res
    //     .status(403)
    //     .json({
    //       message: "Por favor, verifique seu e-mail antes de fazer login.",
    //     });
    // }

    bcrypt.compare(password, usuario.password_hash, (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Erro ao verificar sua senha." });
      }
      if (!isMatch) {
        return res.status(400).json({ message: "E-mail ou senha incorretos." });
      }

      // Gere os tokens
      const accessToken = jwt.sign(
        { id: usuario.id, email: usuario.email, username: usuario.username },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      const refreshToken = jwt.sign(
        { id: usuario.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }, // Refresh token expira em 7 dias
      );

      // Armazene o refresh token no banco, se necessário
      db.query(
        "UPDATE users SET refresh_token = ? WHERE id = ?",
        [refreshToken, usuario.id],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Erro ao salvar refresh token." });
          }

                  if (!usuario.is_verified) {
               return res
                 .status(403)
                 .json({
                   message: "Por favor, verifique seu e-mail antes de fazer login.",
                 });
             }

          res.status(200).json({
            message: "Login Efetuado com sucesso.",
            token: accessToken,
            // user: userData
          });
        },
      );
    });
  });
};
