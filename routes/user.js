const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotpassword,
  verifyOtp,
  resetPassword,
  userDetails,
  allUsers,
} = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotpassword);
router.route("/verify").post(verifyOtp);
router.route("/password/reset").post(resetPassword);
router.route("/user").get(isLoggedIn, userDetails);
router.route("/allusers").get(allUsers);

module.exports = router;
