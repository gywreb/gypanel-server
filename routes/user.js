const express = require("express");
const router = express.Router();
const jwtAuth = require("../middleware/jwtAuth");
const accessControl = require("../middleware/accessControl");
const userController = require("../controllers/userController");
const uploadImg = require("../middleware/uploadImg");

router.get("/getCurrent", jwtAuth, userController.getCurrentUser);
router.get("/", jwtAuth, accessControl, userController.getUserList);
router.patch(
  "/toggleActive/:id",
  jwtAuth,
  accessControl,
  userController.toggleActiveUser
);
router.patch(
  "/updateOne/:id",
  jwtAuth,
  accessControl,
  uploadImg.single("avatar"),
  userController.updateUserById
);

module.exports = router;
