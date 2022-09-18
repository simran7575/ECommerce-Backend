const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  deleteCategory,
  getOneCategory,
} = require("../controllers/categoryController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/categories").get(isLoggedIn, getAllCategories);
router.route("/category/create").post(isLoggedIn, createCategory);
router
  .route("/category")
  .delete(isLoggedIn, deleteCategory)
  .get(isLoggedIn, getOneCategory);

module.exports = router;
