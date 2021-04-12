const asyncMiddleware = require("../middleware/asyncMiddleware");
const Invoice = require("../database/models/Invoice");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getInvoiceList = asyncMiddleware(async (req, res, next) => {
  const invoices = await Invoice.find()
    .populate("fromStaff")
    .populate("clientInfo");
  if (!invoices) return next(new ErrorResponse(404, "no invoice found"));
  res.json(new SuccessResponse(200, { invoices }));
});

exports.createInvoice = asyncMiddleware(async (req, res, next) => {
  const {
    fromStaff,
    clientInfo,
    paymentDate,
    total,
    tax,
    shippingFee,
  } = req.body;
  const invoice = new Invoice({
    fromStaff,
    clientInfo,
    paymentDate,
    total,
    tax,
    shippingFee,
  });
  const newInvoice = await invoice.save();
  res.json(new SuccessResponse(201, { newInvoice }));
});
