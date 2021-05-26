const express = require("express");
const router = express.Router();
const analyticController = require("../controllers/analyticController");
const jwtAuth = require("../middleware/jwtAuth");

router.get("/total", jwtAuth, analyticController.getTotalAnalytic);
router.get("/revenue/:year", jwtAuth, analyticController.getMonthRevenueByYear);
router.get("/rankStaff", jwtAuth, analyticController.rankStaff);

module.exports = router;
