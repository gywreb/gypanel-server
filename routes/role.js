const express = require("express");
const jwtAuth = require("../middleware/jwtAuth");
const router = express.Router();
const roleController = require("../controllers/roleController");
const accessControl = require("../middleware/accessControl");

router
  .route("/")
  .get(jwtAuth, accessControl, roleController.getRoles)
  .post(jwtAuth, accessControl, roleController.createRole);

router.patch("/:id", jwtAuth, accessControl, roleController.toggleActiveRole);

module.exports = router;
