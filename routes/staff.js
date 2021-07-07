const express = require("express");
const accessControl = require("../middleware/accessControl");
const jwtAuth = require("../middleware/jwtAuth");
const staffController = require("../controllers/staffController");
const uploadImg = require("../middleware/uploadImg");
const router = express.Router();

router
  .route("/")
  .get(jwtAuth, accessControl, staffController.getStaffList)
  .post(
    jwtAuth,
    accessControl,
    uploadImg.single("avatar"),
    staffController.createStaff
  );

router
  .route("/:id")
  .get(jwtAuth, accessControl, staffController.getStaffById)
  .patch(jwtAuth, accessControl, staffController.toggleAciveStaff);

router
  .route("/updateOne/:id")
  .patch(
    jwtAuth,
    accessControl,
    uploadImg.single("avatar"),
    staffController.updateStaffById
  );

router.delete("/deleteAll", jwtAuth, accessControl, staffController.deleteAll);

module.exports = router;
