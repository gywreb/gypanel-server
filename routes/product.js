const express = require("express");
const router = express.Router();
const jwtAuth = require("../middleware/jwtAuth");
const uploadImg = require("../middleware/uploadImg");
const productController = require("../controllers/productController");
const accessControl = require("../middleware/accessControl");

router
  .route("/")
  .get(jwtAuth, accessControl, productController.getProductList)
  .post(
    jwtAuth,
    accessControl,
    uploadImg.single("featuredImg"),
    productController.createProduct
  );

router.delete(
  "/deleteAll",
  jwtAuth,
  accessControl,
  productController.deleteAll
);

module.exports = router;
