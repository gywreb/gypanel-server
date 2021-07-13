const User = require("../database/models/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const Role = require("../database/models/Role");

exports.register = asyncMiddleware(async (req, res, next) => {
  const { fullname, email, password, role } = req.body;

  const existedRole = await Role.findById(role);
  if (!existedRole || !existedRole.isActive)
    return next(new ErrorResponse(404, "role is not found"));

  const user = new User({
    fullname,
    email,
    password,
    role: existedRole._id,
  });

  const newUser = await user.save();

  await Role.updateOne({ _id: role }, { $push: { users: newUser._id } });

  res.json(new SuccessResponse(201, { newUser }));
});

exports.login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(new ErrorResponse(404, `no user with email: ${email} found`));
  if (!user.isActive)
    return next(new ErrorResponse(400, "this user is no longer active !"));
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ErrorResponse(400, "password is incorrect"));
  const payload = _.omit(user._doc, "password", "_id", "__v");
  const token = User.generateJwt(payload);

  const role = await Role.findById(user.role);
  if (!role) return next(new ErrorResponse(404, "role of this user not found"));
  if (
    !role.isActive &&
    !role.permissions.includes("all") &&
    !role.methods.includes("ALL")
  )
    return next(
      new ErrorResponse(
        400,
        "your position(role) is longer active, Please contact your Admin"
      )
    );

  res.json(
    new SuccessResponse(200, {
      token,
      userInfo: payload,
      role: role.name,
      routes: role.permissions,
      methods: role.methods,
    })
  );
});
