const asyncMiddleware = require("../middleware/asyncMiddleware");
const Product = require("../database/models/Product");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");

exports.getProductList = asyncMiddleware(async (req, res, next) => {
  const products = await Product.find().populate("categories");
  if (!products) return next(new ErrorResponse(404, "no product found"));
  res.json(new SuccessResponse(200, { products }));
});

exports.createProduct = asyncMiddleware(async (req, res, next) => {
  const { name, price, quantity } = req.body;
  const priceNumber = parseInt(price);

  const product = new Product({
    name,
    categories,
    price: priceNumber,
    featuredImg: req.file ? req.file.filename : "",
    quantity,
  });
  const newProduct = await product.save();
  res.json(new SuccessResponse(201, { newProduct }));
});
