const Role = require("../database/models/Role");
const asyncMiddleware = require("../middleware/asyncMiddleware");
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
