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
    const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verificado</title>
</head>
<body style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #fde2e4;">
    <a href="http://localhost:5500/frontend/pages/login.html" style="text-decoration: none; color: white;">
      <div style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center;">
        <h2 style="color: black; font-family: Arial, sans-serif;">Seu email foi verificado!</h2>
      </div>
    </a>
</body>
</html>
`;
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
