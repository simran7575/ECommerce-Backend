const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  deleteProduct,
  createProduct,
  updateOneProduct,
  getOneProduct,
} = require("../controllers/productController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/products").get(isLoggedIn, getAllProducts);

router.route("/product/create").post(isLoggedIn, createProduct);


router
  .route("/product")
  .get(isLoggedIn, getOneProduct)
  .put(isLoggedIn, updateOneProduct)
  .delete(isLoggedIn, deleteProduct);

module.exports = router;
