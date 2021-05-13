const Role = require("../database/models/Role");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getRoles = asyncMiddleware(async (req, res, next) => {
  const roles = await Role.find();
  res.json(new SuccessResponse(200, { roles }));
});

exports.createRole = asyncMiddleware(async (req, res, next) => {
  const { name, permissions, methods } = req.body;
  const role = new Role({
    name,
    permissions,
    methods,
  });

  const newRole = await role.save();
  res.json(new SuccessResponse(200, { newRole }));
});

exports.toggleActiveRole = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const role = await Role.findById(id);
  if (!role) return next(new ErrorResponse(404, "no role found"));
  await Role.updateOne({ _id: role.id }, { isActive: !role.isActive });
  res.json(new SuccessResponse(200, "successfully change active state"));
});
