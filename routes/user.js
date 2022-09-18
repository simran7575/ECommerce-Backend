const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotpassword,
  resetpassword,
} = require("../controllers/userController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/password/reset").post(resetpassword);

module.exports = router;
