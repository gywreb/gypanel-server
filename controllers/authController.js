const User = require("../database/models/User");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

exports.register = asyncMiddleware(async (req, res, next) => {
  const { fullname, email, password } = req.body;
  const user = new User({
    fullname,
    email,
    password,
  });
  const newUser = await user.save();
  res.json(new SuccessResponse(201, { newUser }));
});

exports.login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(new ErrorResponse(404, `no user with email: ${email} found`));
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ErrorResponse(400, "password is incorrect"));
  const payload = _.omit(user._doc, "password", "_id", "__v");
  const token = User.generateJwt(payload);
  res.json(new SuccessResponse(200, { token }));
});
