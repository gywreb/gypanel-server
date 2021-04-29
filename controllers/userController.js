const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const _ = require("lodash");
const { SuccessResponse } = require("../models/SuccessResponse");
const Role = require("../database/models/Role");

exports.getCurrentUser = asyncMiddleware(async (req, res, next) => {
  const { user } = req;
  if (!user) return next(new ErrorResponse(401, "unauthorized"));
  const userInfo = _.omit(user._doc, "password", "_id", "__v");

  const role = await Role.findById(userInfo.role);
  if (!role) return next(new ErrorResponse(404, "role not found"));

  res.json(
    new SuccessResponse(200, {
      userInfo,
      role: role.name,
      routes: role.permissions,
      methods: role.methods,
    })
  );
});
