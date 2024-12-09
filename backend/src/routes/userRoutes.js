const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userController");
const passwordResetController = require("../controllers/passwordResetController");
const validatePassword = require("../utils/passwordValidator");
// Rota de cadastro
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("O nome é obrigatório."),

    body("email").isEmail().withMessage("Forneça um e-mail válido."),

    validatePassword,
  ],
  userController.register,
);

// Rota de recuperação de senha
router.post("/forgot-password", passwordResetController.requestPassswordReset);
router.post(
  "/reset-password",
  [validatePassword],
  passwordResetController.resetPassword,
);

module.exports = router;
