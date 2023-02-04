const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/adminModels/userModel");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthUser = catchAsyncErrors(async (req, res, next) => {
  // const { token } = req.cookies;
  const { token } = req.headers;
  if (!token) {
    return next(new ErrorHandler("You are not authenticated", 401));
  }
  const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodetoken.id);
  next();
});