const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Product = require("../models/product");

exports.getAllProducts = BigPromise(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

exports.deleteProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return res.status(200).json(CustomError("No such product exist", 400));
  }

  await product.remove();

  return res.status(200).json({
    success: true,
    message: "Product deleted",
  });
});

exports.createProduct = BigPromise(async (req, res, next) => {
  //const { name, price, description, avatar, category, developerEmail } = req.body;

  const product = await Product.create(req.body);

  return res.status(200).json({
    success: true,
    message: "Product added",
    product,
  });
});

exports.updateOneProduct = BigPromise(async (req, res, next) => {
  let product = await Product.findById(req.query.id);
  if (!product) {
    return res.status(200).json(CustomError("No such product exist", 400));
  }

  product = await Product.findByIdAndUpdate(req.query.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).json({
    success: true,
    product,
  });
});
exports.getOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return res.status(200).json(CustomError("No such product exist", 400));
  }
console.log(product)
  return res.status(200).json({
    success: true,
    product,
  });
});
