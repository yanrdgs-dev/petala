const express = require("express");
const router = express.Router();
const sendEmail = require("../controllers/mail");
// const send = require("../services/nodemailer");

router.post("/",sendEmail)

module.exports = router