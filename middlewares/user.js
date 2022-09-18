const CustomError = require("../utils/customError");
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const crypto = require("crypto");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  if (!req.header("Authorization")) {
    return res.status(200).json(CustomError("Token missing", 401));
  }
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    return res
      .status(200)
      .json(CustomError("Please log in to find more information", 501));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch (error) {
    return res.status(200).json(CustomError("Token has expired", 501));
  }

  next();
});

exports.isTokenValid = BigPromise(async (req, res, next) => {
  const token = req.query.token;
  const encryptedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    encryptedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.redirect("/api/v1/resettoken");
  }
  req.user = user;
  next();
});
