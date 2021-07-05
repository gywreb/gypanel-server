const asyncMiddleware = require("../middleware/asyncMiddleware");
const Invoice = require("../database/models/Invoice");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");
const Staff = require("../database/models/Staff");
const Customer = require("../database/models/Customer");
const Product = require("../database/models/Product");
const { EmailService } = require("../services/EmailService");
const moment = require("moment");
const { NotificationService } = require("../services/NotificationService");

exports.getInvoiceList = asyncMiddleware(async (req, res, next) => {
  const invoices = await Invoice.find().populate("fromStaff clientInfo");
  if (!invoices) return next(new ErrorResponse(404, "no invoice found"));
  res.json(new SuccessResponse(200, { invoices }));
});

exports.createInvoice = asyncMiddleware(async (req, res, next) => {
  const { fromStaff, clientInfo, productList, paymentDate, tax, shippingFee } =
    req.body;

  const existedStaff = await Staff.findById(fromStaff);
  if (!existedStaff || !existedStaff.isActive)
    return next(new ErrorResponse(404, "staff not found"));

  const existedCustomer = await Customer.findById(clientInfo);
  if (!existedCustomer || !existedCustomer.isActive)
    return next(new ErrorResponse(404, "customer is not found"));
  const productListCheck = productList.map((product) => product.id);
  const existedProducts = await Product.find({ _id: productListCheck });
  const isInActiveExisted = existedProducts.find(
    (product) => !product.isActive
  );
  if (!existedProducts.length)
    return next(new ErrorResponse(404, "no such product existed"));
  if (isInActiveExisted)
    return next(new ErrorResponse(400, "one of the product is inactive"));

  const total = await productList.reduce(async (acc, product) => {
    const productFromDB = await Product.findById(product.id);
    return (await acc) + product.quantity * productFromDB.price;
  }, Promise.resolve(0));

  const responseProductList = await Promise.all(
    productList.map(async (product) => {
      const productFromDB = await Product.findById(product.id);
      const price = productFromDB.price * product.quantity;
      return {
        id: product.id,
        name: productFromDB.name,
        price,
        quantity: product.quantity,
      };
    })
  );

  const invoice = new Invoice({
    fromStaff,
    clientInfo,
    productList: responseProductList,
    paymentDate,
    total,
    tax,
    shippingFee,
  });

  const newInvoice = await invoice.save();
  NotificationService.init();
  await NotificationService.sendNotification(
    "New invoice is arrived! Please confrim"
  );
  res.json(new SuccessResponse(201, { newInvoice }));
});

exports.getInvoiceById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const invoice = await Invoice.findById(id);
  if (!invoice) return next(new ErrorResponse(404, "no invoice found"));
  res.json(new SuccessResponse(200, { invoice }));
});

exports.confirmInvoice = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const { confirmDate } = req.body;
  const invoice = await Invoice.findById(id);
  if (!invoice) return next(new ErrorResponse(404, "no invoice found"));
  await Invoice.updateOne(
    { _id: id },
    {
      isConfirm: true,
      confirmDate: confirmDate || moment().format(),
    }
  );
  await Staff.updateOne(
    { _id: invoice.fromStaff, invoices: { $ne: invoice._id } },
    { $push: { invoices: invoice._id } }
  );
  const customer = await Customer.findById(invoice.clientInfo);
  if (!customer) return next(new ErrorResponse(404, "no customer found"));
  EmailService.init();
  await EmailService.sendInvoiceEmail(
    customer.email,
    "Your order is confirmed",
    "Thank you for shopping at our store",
    invoice,
    next
  );

  res.json(new SuccessResponse(200, "successfully confirm invoice"));
});

exports.deleteAll = asyncMiddleware(async (req, res, next) => {
  await Invoice.deleteMany();
  res.json(new SuccessResponse(200, "deleted all invoices"));
});
