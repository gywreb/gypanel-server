const asyncMiddleware = require("../middleware/asyncMiddleware");
const Product = require("../database/models/Product");
const { SuccessResponse } = require("../models/SuccessResponse");
const { ErrorResponse } = require("../models/ErrorResponse");
const Category = require("../database/models/Category");

exports.getProductList = asyncMiddleware(async (req, res, next) => {
  const products = await Product.find().populate("categories");
  if (!products) return next(new ErrorResponse(404, "no product found"));
  res.json(new SuccessResponse(200, { products }));
});

exports.createProduct = asyncMiddleware(async (req, res, next) => {
  const { name, price, categories, quantity, images } = req.body;
  const priceNumber = parseInt(price);

  const product = new Product({
    name,
    categories: null,
    price: priceNumber,
    images: images ? images : [],
    featuredImg: req.file ? req.file.filename : "",
    quantity,
  });

  // add new products to the specific categories
  let newProduct;
  if (categories.length) {
    const existedCategories = await Category.find({ _id: categories });
    if (!existedCategories.length)
      return next(new ErrorResponse(404, "no such categories existed"));

    product.categories = [...categories];

    newProduct = await product.save();

    await Category.updateMany(
      { _id: newProduct.categories },
      { $push: { products: newProduct._id } }
    );
  } else {
    newProduct = await product.save();
  }

  res.json(new SuccessResponse(201, { newProduct }));
});

exports.deleteAll = asyncMiddleware(async (req, res, next) => {
  await Product.deleteMany();
  res.json(new SuccessResponse(200, "deleted all products"));
});

exports.toggleActiveProduct = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return next(new ErrorResponse(404, "no product found"));
  await Product.updateOne(
    { _id: product._id },
    { isActive: !product.isActive }
  );
  res.json(new SuccessResponse(200, "successfully change active state"));
});
