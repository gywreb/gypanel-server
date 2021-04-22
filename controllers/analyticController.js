const Product = require("../database/models/Product");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getTotalAnalytic = asyncMiddleware(async (req, res, next) => {
  const activeProducts = await Product.find({ isActive: true });
  res.json(new SuccessResponse(200, { activeProducts }));
});
