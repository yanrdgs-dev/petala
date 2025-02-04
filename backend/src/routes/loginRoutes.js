const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const loginController = require('../controllers/loginController.js');
// const

router.post(
  '/',
  [
    body('email').trim().notEmpty().withMessage('O e-mail é obrigatório.'),
    body('password').trim().notEmpty().withMessage('A senha é obrigatória.'),
  ],
  loginController.login
);
  module.exports = router;

