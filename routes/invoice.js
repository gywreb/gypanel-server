const express = require("express");
const accessControl = require("../middleware/accessControl");
const jwtAuth = require("../middleware/jwtAuth");
const invoiceController = require("../controllers/invoiceController");
const router = express.Router();

router
  .route("/")
  .get(jwtAuth, accessControl, invoiceController.getInvoiceList)
  .post(jwtAuth, accessControl, invoiceController.createInvoice);

router
  .route("/:id")
  .get(jwtAuth, accessControl, invoiceController.getInvoiceById);

router.patch(
  "/confirm/:id",
  jwtAuth,
  accessControl,
  invoiceController.confirmInvoice
);

router.delete(
  "/deleteAll",
  jwtAuth,
  accessControl,
  invoiceController.deleteAll
);

module.exports = router;
