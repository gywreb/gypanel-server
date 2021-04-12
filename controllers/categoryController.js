const asyncMiddleware = require("../middleware/asyncMiddleware");
const Category = require("../database/models/Category");
const { ErrorResponse } = require("../models/ErrorResponse");
const { SuccessResponse } = require("../models/SuccessResponse");
const Product = require("../database/models/Product");

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

exports.deleteCategoryById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);
  if (!deletedCategory)
    return next(new ErrorResponse(404, "category is not found"));
  res.json(new SuccessResponse(200, "category is deleted"));

  // Delete category from product
});
