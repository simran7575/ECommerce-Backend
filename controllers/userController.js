const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const User = require("../models/user");
const { mailHelper } = require("../utils/emailHelper");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  if (!(firstname && lastname && email && password)) {
    return res.status(200).json(CustomError("All fields required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(200).json(CustomError("User Already Exist", 400));
  }

  const myEncPassword = await bcrypt.hash(password, 10);

  const userCreate = await User.create({
    firstname,
    lastname,
    email: email.toLowerCase(),
    password: myEncPassword,
  });
  const token = userCreate.getJwtToken();
  userCreate.password = undefined;

  return res.status(200).json({
    success: "true",
    message: "User created successfully",
    userCreate,
    token,
  });
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(200).json(CustomError("All fields required", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(200).json(CustomError("No User Found", 400));
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = user.getJwtToken();
    user.password = undefined;
    // res.status(200).json(user);

    return res.status(200).json({
      success: "true",
      message: "User Logged in successfully",
      user,
      token,
    });
  }
  return res.status(200).json(CustomError("Incorrect email or password", 400));
});

exports.forgotpassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json(CustomError("User not Found", 400));
  }
  const forgotToken = Math.floor(100000 + Math.random() * 900000);
  user.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;
  user.forgotPasswordToken = forgotToken;
  await user.save({ validateBeforeSave: false });

  const message = `Hi ${user.firstname} ${user.lastname}\nForgot Your Password?\nWe received the request to reset the password for your account\n\nTo reset your password enter the following code \n\n${forgotToken}\n\nIf you did not initiate the request, you can surely ignore this email\n\n\nThanks.\nEStore Team`;

  try {
    await mailHelper({
      email,
      subject: "Resetting Password mail",
      message,
    });
    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(CustomError(error.message, 400));
  }
});

exports.verifyOtp = BigPromise(async (req, res, next) => {
  const code = req.body.code;
  const user = await User.findOne({
    forgotPasswordToken: code,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(200).json(CustomError("Invalid OTP", 400));
  } else {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: true,
      message: "OTP Verified",
    });
  }
});

exports.resetPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  const myEncPassword = await bcrypt.hash(req.body.password, 10);
  user.password = myEncPassword;
  await user.save();
  const token = user.getJwtToken();
  res.status(200).json({
    success: true,
    user,
    message: "Password Changed Successfully!",
    token,
  });
});
exports.userDetails = BigPromise(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
exports.allUsers = BigPromise(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
