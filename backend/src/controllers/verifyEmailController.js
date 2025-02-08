const jwt = require("jsonwebtoken");
const db = require("../config/db");

const verifyEmail = (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send("Token de verificação não fornecido.");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).send("Token inválido ou expirado.");
    }

    const userId = decoded.id;
    const html = `<h1>Seu Email Foi verificado com sucesso!</h1>`;
    // Atualiza o status de verificação do usuário no banco de dados
    db.query(
      "UPDATE users SET is_verified = 1 WHERE id = ?",
      [userId],
      (err, result) => {
        if (err) {
          return res.status(500).send("Erro ao verificar o e-mail.");
        }
      
        return res.send(html)
      }
    );
  });
};

module.exports = verifyEmail;
