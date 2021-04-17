const Role = require("../database/models/Role");
const { ErrorResponse } = require("../models/ErrorResponse");
const asyncMiddleware = require("./asyncMiddleware");

const accessControl = asyncMiddleware(async (req, res, next) => {
  const { user } = req;
  if (!user) return next(new ErrorResponse(401, "unauthorized"));
  const role = await Role.findById(user.role);
  //   console.log(role);
  //   console.log(req.originalUrl.split("/")[3]);
  if (role.permissions.includes("all") && role.methods.includes("ALL"))
    return next();
  if (
    !role.permissions.includes(req.originalUrl.split("/")[3]) ||
    !role.methods.includes(req.method)
  ) {
    return next(new ErrorResponse(403, "permission not allowed"));
  }
  next();
});

module.exports = accessControl;
