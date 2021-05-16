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

exports.deleteAll = asyncMiddleware(async (req, res, next) => {
  await Category.deleteMany();
  res.json(new SuccessResponse(200, "deleted all categories"));
});

exports.toggleActiveCategory = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) return next(new ErrorResponse(404, "no category found"));
  await Category.updateOne(
    { _id: category._id },
    { isActive: !category.isActive }
  );
  res.json(new SuccessResponse(200, "successfully change active state"));
});

exports.getCategoryById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) return next(new ErrorResponse(404, "no category found"));
  res.json(new SuccessResponse(200, { category }));
});

exports.updateCategoryById = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const updateParams = req.body;
  const category = await Category.findOne({ _id: id });

  for (let property in updateParams) {
    category[property] = updateParams[property];
  }
  const updatedCategory = await category.save();
  res.json(new SuccessResponse(200, { updatedCategory }));
});
