const express = require("express");
const router = express.Router();
const { sendWelcomeEmail } = require("../controllers/mail.js");


router.post("/", async (req, res) => {
  const { to, name, verificationLink } = req.body;
  
  if (!to || !name || !verificationLink) {
    return res.status(400).json({ 
      message: "Os campos 'to', 'name' e 'verificationLink' são obrigatórios." 
    });
  }
  
  try {
    await sendWelcomeEmail(to, name, verificationLink);
    res.status(200).json({ message: "Email enviado com sucesso!" });
  } catch (error) {
    res.status(500).json({ 
      message: "Erro ao enviar email", 
      error: error.message 
    });
  }
});

module.exports = router;
