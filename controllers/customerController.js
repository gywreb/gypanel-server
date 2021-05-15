const asyncMiddleware = require("../middleware/asyncMiddleware");
const Customer = require("../database/models/Customer");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getCustomerList = asyncMiddleware(async (req, res, next) => {
  const customers = await Customer.find();
  if (!customers) return next(new ErrorResponse(404, "no customer found"));
  res.json(new SuccessResponse(200, { customers }));
});

exports.createCustomer = asyncMiddleware(async (req, res, next) => {
  const { fullname, gender, email } = req.body;
  const customer = new Customer({
    fullname,
    gender,
    email,
  });
  const newCustomer = await customer.save();
  res.json(new SuccessResponse(200, { newCustomer }));
});

exports.getCustomerById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const customer = await Customer.findById(id);
  if (!customer) return next(new ErrorResponse(404, "no customer found"));
  res.json(new SuccessResponse(200, { customer }));
});

exports.deleteAll = asyncMiddleware(async (req, res, next) => {
  await Customer.deleteMany();
  res.json(new SuccessResponse(200, "delete all customers"));
});
