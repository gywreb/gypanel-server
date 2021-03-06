const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const accessControl = require("../middleware/accessControl");
const jwtAuth = require("../middleware/jwtAuth");

router.get("/:filename", fileController.getFile);

module.exports = router;
