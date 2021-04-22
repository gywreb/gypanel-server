const asyncMiddleware = require("../middleware/asyncMiddleware");
const Department = require("../database/models/Department");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");

exports.getDepartments = asyncMiddleware(async (req, res, next) => {
  const departments = await Department.find();
  if (!departments) return next(new ErrorResponse(404, "no department found"));
  res.json(new SuccessResponse(200, { departments }));
});

exports.createDepartment = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body;
  const department = new Department({ name });
  const newDepartment = await department.save();
  res.json(new SuccessResponse(201, { newDepartment }));
});

exports.toggleActiveDepartment = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const department = await Department.findById(id);
  if (!departments) return next(new ErrorResponse(404, "no department found"));
  await Department.updateOne({
    _id: department._id,
    isActive: !department.isActive,
  });
  res.json(new SuccessResponse(200, "successfully change active state"));
});
