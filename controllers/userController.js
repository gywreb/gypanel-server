const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const _ = require("lodash");
const { SuccessResponse } = require("../models/SuccessResponse");
const Role = require("../database/models/Role");
const User = require("../database/models/User");

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

exports.getUserList = asyncMiddleware(async (req, res, next) => {
  const { user } = req;
  const users = await User.find({ _id: !user._id });
  if (!users) return next(new ErrorResponse(404, "no user found"));
  res.json(new SuccessResponse(200, { users }));
});

exports.toggleActiveUser = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  if (req.user._id === id)
    return next(new (400, "can't toggle your own account")());
  const user = await User.findById(id);
  if (!user) return next(new ErrorResponse(404, "no user found"));
  await User.updateOne({ _id: user._id }, { isActive: !user.isActive });
  res.json(new SuccessResponse(200, "successfully change active state"));
});

exports.getUserById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return next(new ErrorResponse(404, "no user found"));
  res.json(new SuccessResponse(200, { user }));
});

exports.updateUserById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  let updateParams = req.body;
  const user = await User.findOne({ _id: id });
  if (!user) return next(new ErrorResponse(404, "no user found"));

  // update logic
  if (req.file) user.avatar = req.file.filename;
  if (updateParams.role) {
    const existedRole = await Role.findById(updateParams.role);
    if (!existedRole || !existedRole.isActive)
      return next(new ErrorResponse(404, "role not found"));
    else {
      user.role = updateParams.role;
      updateParams = _.omit(updateParams, "role");
      await Role.updateOne(
        { _id: updateParams.role },
        { $push: { users: id } }
      );
      await Role.updateOne(
        { _id: updateParams.role },
        { $pull: { users: id } }
      );
    }
  }
  for (let property in updateParams) {
    user[property] = updateParams[property];
  }
  const updatedUser = await user.save();
  res.json(new SuccessResponse(200, { updatedUser }));
});
