const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const userController = require("../controllers/userController");
const validatePassword = require("../utils/passwordValidator");
const passwordResetController = require("../controllers/passwordResetController");

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

module.exports = router;
