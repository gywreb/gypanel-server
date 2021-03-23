const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const basicAuth = require("../middleware/basicAuth");

router.post("/register", basicAuth, authController.register);
router.post("/login", basicAuth, authController.login);

module.exports = router;
