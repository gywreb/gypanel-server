const express = require("express");
const router = express.Router();
const jwtAuth = require("../middleware/jwtAuth");
const categoryController = require("../controllers/categoryController");

router
  .route("/")
  .get(jwtAuth, categoryController.getCategoryList)
  .post(jwtAuth, categoryController.createCategory);

module.exports = router;
