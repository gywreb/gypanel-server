const express = require("express");
const jwtAuth = require("../middleware/jwtAuth");
const router = express.Router();
const roleController = require("../controllers/roleController");
const accessControl = require("../middleware/accessControl");

router
  .route("/")
  .get(jwtAuth, accessControl, roleController.getRoles)
  .post(jwtAuth, roleController.createRole);

module.exports = router;
