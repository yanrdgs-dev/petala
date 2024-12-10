const { body } = require("express-validator");

const validatePassword = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("A senha deve ter pelo menos 8 caracteres.")
    .matches(/\d/)
    .withMessage("A senha deve conter pelo menos um número.")
    .matches(/[A-Za-z]/)
    .withMessage("A senha deve conter pelo menos uma letra."),
];

module.exports = validatePassword;
