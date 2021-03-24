const express = require("express");
const router = express.Router();
const jwtAuth = require("../middleware/jwtAuth");
const userController = require("../controllers/userController");

router.get("/getCurrent", jwtAuth, userController.getCurrentUser);

module.exports = router;
