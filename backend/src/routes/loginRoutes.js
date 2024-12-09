const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const loginController = require('../controllers/loginController.js');


router.post('/',[

    body('name').trim().notEmpty().withMessage("O nome é obrigatório"),
    body('password').trim().notEmpty().withMessage("A senha é obrigatória")], loginController.login)
  
  
  module.exports = router;