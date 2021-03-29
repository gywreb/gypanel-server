const asyncMiddleware = require("../middleware/asyncMiddleware");
const Category = require("../database/models/Category");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");

exports.getCategoryList = asyncMiddleware(async (req, res, next) => {
  const categories = await Category.find();
  if (!categories) return next(new ErrorResponse(404, "no category found"));
  res.json(new SuccessResponse(200, { categories }));
});

exports.createCategory = asyncMiddleware(async (req, res, next) => {
  const { name } = req.body;
  const category = new Category({
    name,
  });
  const newCategory = await category.save();
  res.json(new SuccessResponse(200, { newCategory }));
});
