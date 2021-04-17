const express = require("express");
const router = express.Router();
const jwtAuth = require("../middleware/jwtAuth");
const categoryController = require("../controllers/categoryController");
const accessControl = require("../middleware/accessControl");

router
  .route("/")
  .get(jwtAuth, accessControl, categoryController.getCategoryList)
  .post(jwtAuth, accessControl, categoryController.createCategory);

router.delete(
  "/deleteAll",
  jwtAuth,
  accessControl,
  categoryController.deleteAll
);

router
  .route("/:id")
  .patch(jwtAuth, accessControl, categoryController.toggleActiveCategory);

module.exports = router;
