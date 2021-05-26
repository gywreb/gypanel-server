const Product = require("../database/models/Product");
const Staff = require("../database/models/Staff");
const Invoice = require("../database/models/Invoice");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");
const User = require("../database/models/User");
const moment = require("moment");

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
        active: invoices.filter((invoice) => invoice.isConfirm).length,
        inActive: invoices.filter((invoice) => !invoice.isConfirm).length,
      },
      user: {
        active: users.filter((user) => user.isActive).length,
        inActive: users.filter((user) => !user.isActive).length,
      },
    })
  );
});

exports.rankStaff = asyncMiddleware(async (req, res, next) => {
  const staffs = await Staff.find({ isActive: true });
  const staffWithRevenue = await Promise.all(
    staffs.map(async (staff) => {
      const revenueMake = await staff.invoices.reduce(async (acc, invoice) => {
        const invoiceDB = await Invoice.findById(invoice);
        return (await acc) + invoiceDB.total;
      }, Promise.resolve(0));
      return { ...staff._doc, revenueMake };
    })
  );
  const rankedList = staffWithRevenue.sort(
    (thisStaff, thatStaff) => thatStaff.revenueMake - thisStaff.revenueMake
  );
  res.json(new SuccessResponse(200, { rankedList }));
});

exports.getMonthRevenueByYear = asyncMiddleware(async (req, res, next) => {
  const { year } = req.params;
  const invoices = await Invoice.find();
  const yearInvoices = invoices.filter(
    (invoice) => moment(invoice.confirmDate).year() === parseInt(year)
  );
  const monthRevenue = yearInvoices.reduce(
    (acc, invoice) => {
      const key = moment(invoice.confirmDate).month() + 1;
      acc[key] += invoice.total;
      return acc;
    },
    {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    }
  );

  res.json(new SuccessResponse(200, { monthRevenue }));
});
