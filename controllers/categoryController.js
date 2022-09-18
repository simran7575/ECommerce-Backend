const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const Category = require("../models/category");

exports.getAllCategories = BigPromise(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    success: true,
    categories,
  });
});
exports.createCategory = BigPromise(async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(200)
      .json(CustomError("Please provide category name", 400));
  }

  const category = await Category.create({
    name,
  });

  return res.status(200).json({
    success: true,
    message: "Category added",
    category,
  });
});
exports.deleteCategory = BigPromise(async (req, res, next) => {
  let category = await Category.findById(req.query.id);
  if (!category) {
    return res.status(200).json(CustomError("No such category exist", 400));
  }

  await category.remove();

  return res.status(200).json({
    success: true,
    message: "Category deleted",
  });
});
exports.getOneCategory = BigPromise(async (req, res, next) => {
  let category = await Category.findById(req.query.id);
  if (!category) {
    return res.status(200).json(CustomError("No such category exist", 400));
  }

  return res.status(200).json({
    success: true,
    category,
  });
});
