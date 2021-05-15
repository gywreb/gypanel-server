const express = require("express");
const accessControl = require("../middleware/accessControl");
const jwtAuth = require("../middleware/jwtAuth");
const customerController = require("../controllers/customerController");
const router = express.Router();

router
  .route("/")
  .get(jwtAuth, accessControl, customerController.getCustomerList)
  .post(jwtAuth, accessControl, customerController.createCustomer);

router
  .route("/:id")
  .get(jwtAuth, accessControl, customerController.getCustomerById);

module.exports = router;
