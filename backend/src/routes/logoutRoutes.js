const express = require("express");
const logoutRoutes = require('../controllers/logoutController.js');
const router = express.Router()



router.get('/', logoutRoutes.logout);

module.exports = router