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
  return res.status(200).json(CustomError("Incorrect email and password", 400));
});

exports.forgotpassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json(CustomError("User not Found", 400));
  }
  const forgotToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const createdUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetpassword?token=${forgotToken}`;

  const message = `Copy paste this link into your Url and hit enter \n\n ${createdUrl}`;

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

exports.resetpassword = BigPromise(async (req, res, next) => {

  const email = req.body.user;
  const user = await User.findOne({ email });

  console.log(req.body);
  console.log(user);

  const myEncPassword = await bcrypt.hash(req.body.password, 10);
  user.password = myEncPassword;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Password Changed",
  });
});