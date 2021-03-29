const express = require("express");
const router = express.Router();
const jwtAuth = require("../middleware/jwtAuth");
const uploadImg = require("../middleware/uploadImg");
const productController = require("../controllers/productController");

router
  .route("/")
  .get(jwtAuth, productController.getProductList)
  .post(
    jwtAuth,
    uploadImg.single("featuredImg"),
    productController.createProduct
  );

module.exports = router;
