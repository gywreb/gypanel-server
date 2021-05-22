const express = require("express");
const router = express.Router();
const analyticController = require("../controllers/analyticController");
const accessControl = require("../middleware/accessControl");
const jwtAuth = require("../middleware/jwtAuth");

router.get("/total", jwtAuth, analyticController.getTotalAnalytic);

module.exports = router;
