const Product = require("../database/models/Product");
const Staff = require("../database/models/Staff");
const Invoice = require("../database/models/Invoice");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");
const User = require("../database/models/User");

exports.getTotalAnalytic = asyncMiddleware(async (req, res, next) => {
  const products = await Product.find();
  const staffs = await Staff.find();
  const invoices = await Invoice.find();
  const users = await User.find();
  if (!products || !staffs || !invoices || !users)
    return next(new ErrorResponse(404, "resource not found"));
  res.json(
    new SuccessResponse(200, {
      product: {
        active: products.filter((product) => product.isActive).length,
        inActive: products.filter((product) => !product.isActive).length,
      },
      staff: {
        active: staffs.filter((staff) => staff.isActive).length,
        inActive: staffs.filter((staff) => !staff.isActive).length,
      },
      invoice: {
        active: invoices.filter((invoice) => invoice.isActive).length,
        inActive: invoices.filter((invoice) => !invoice.isActive).length,
      },
      user: {
        active: users.filter((user) => user.isActive).length,
        inActive: users.filter((user) => !user.isActive).length,
      },
    })
  );
});
