const { validationResult } = require("express-validator");
const db = require("../config/db");
const session = require("express-session");

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao encerrar a sessão." });
    }
    return res.status(200).json({ message: "Logout bem-sucedido" });
  });
};