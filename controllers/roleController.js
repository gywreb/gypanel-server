const Role = require("../database/models/Role");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getRoles = asyncMiddleware(async (req, res, next) => {
  const roles = await Role.find();
  res.json(new SuccessResponse(200, { roles }));
});

exports.createRole = asyncMiddleware(async (req, res, next) => {
  let { name, permissions, methods } = req.body;

  permissions = [...permissions.map((permission) => permission.toLowerCase())];

  if (permissions.includes("product")) {
    if (!(permissions.includes("category") && methods.includes("GET")))
      return res.json(
        new ErrorResponse(
          400,
          "Warning: GET method & category permission must need for product related permission!"
        )
      );
  }
  if (permissions.includes("user")) {
    if (!(permissions.includes("role") && methods.includes("GET")))
      return res.json(
        new ErrorResponse(
          400,
          "Warning: GET method & role permission must need for user related permission!"
        )
      );
  }

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

exports.getRoleById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const role = await Role.findById(id);
  if (!role) return next(new ErrorResponse(404, "no role found"));
  res.json(new SuccessResponse(200, { role }));
});
