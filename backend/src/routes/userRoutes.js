const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userController");
const passwordResetController = require("../controllers/passwordResetController");
// Rota de cadastro
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("O nome é obrigatório."),

    body("email").isEmail().withMessage("Forneça um e-mail válido."),

    body("password")
      .isLength({ min: 8 })
      .withMessage("A senha deve ter pelo menos 8 caracteres.")
      .matches(/\d/)
      .withMessage("A senha deve conter pelo menos um número.")
      .matches(/[A-Za-z]/)
      .withMessage("A senha deve conter pelo menos uma letra."),
  ],
  userController.register,
);

// Rota de recuperação de senha
// router.post("/forgot-password", userController.requestPassswordReset);
// router.post("/reset-password", passwordResetController.resetPassword);

module.exports = router;
