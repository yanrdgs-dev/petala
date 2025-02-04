const express = require("express");
const router = express.Router();
const verifyEmail = require("../controllers/verifyEmailController");

router.get("/", verifyEmail);

module.exports = router;
