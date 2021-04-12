const Staff = require("../database/models/Staff");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getStaffList = asyncMiddleware(async (req, res, next) => {
  const staffs = await Staff.find().populate("invoices");
  if (!staffs) return next(new ErrorResponse(404, "no staff found"));
  res.json(200, new SuccessResponse(200, { staffs }));
});

exports.createStaff = asyncMiddleware(async (req, res, next) => {
  const {
    firstname,
    lastname,
    gender,
    contactEmail,
    address,
    birthday,
    company,
    phone,
  } = req.body;
  const staff = new Staff({
    firstname,
    lastname,
    gender,
    contactEmail,
    address,
    birthday,
    company,
    phone,
    avatar: req.file ? req.file.filename : null,
  });
  const newStaff = await staff.save();
  res.json(new SuccessResponse(201, { newStaff }));
});
