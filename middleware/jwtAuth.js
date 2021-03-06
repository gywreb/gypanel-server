const { ErrorResponse } = require("../models/ErrorResponse");
const jwt = require("jsonwebtoken");
const User = require("../database/models/User");
const asyncMiddleware = require("./asyncMiddleware");

const jwtAuth = asyncMiddleware(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token) return next(new ErrorResponse(401, "unauthorized"));

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  try {
    req.user = await User.findOne({ email: decode.email });
    next();
  } catch (error) {
    next(new ErrorResponse(401, "unauthorized"));
  }
});

module.exports = jwtAuth;
