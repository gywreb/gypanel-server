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

exports.deleteAll = asyncMiddleware(async (req, res, next) => {
  await Staff.deleteMany();
  res.json(new SuccessResponse(200, "deleted all staffs"));
});

exports.getStaffById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const staff = await Staff.findById(id);
  if (!staff) return next(new ErrorResponse(404, "no staff found"));
  res.json(new SuccessResponse(200, { staff }));
});

exports.toggleAciveStaff = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const staff = await Staff.findById(id);
  if (!staff) return next(new ErrorResponse(404, "no staff found"));
  await Staff.updateOne({ _id: id }, { isActive: !staff.isActive });
  res.json(new SuccessResponse(200, "successfully changed active state"));
});

exports.updateStaffById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  let updateParams = req.body;
  const staff = await Staff.findOne({ _id: id });
  if (!staff) return next(new ErrorResponse(404, "no staff found"));

  //update logic
  if (req.file) staff.avatar = req.file.filename;
  for (let property in updateParams) {
    staff[property] = updateParams[property];
  }
  const updatedStaff = await staff.save();
  res.json(new SuccessResponse(200, { updatedStaff }));
});
