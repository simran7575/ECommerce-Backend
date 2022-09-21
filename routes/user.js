const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotpassword,
  verifyOtp,
  resetpassword,
  userDetails,
} = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/verify").post(verifyOtp);
router.route("/password/reset").post(resetpassword);
router.route("/user").get(isLoggedIn, userDetails);

module.exports = router;
