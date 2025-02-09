const express = require("express");
const router = express.Router();
const passwordResetController = require("../controllers/passwordResetController");

// Rota para solicitar a redefinição de senha
router.post("/request", passwordResetController.requestPasswordReset);

// Rota para efetuar a redefinição de senha
router.post("/reset", passwordResetController.resetPassword);

module.exports = router;
