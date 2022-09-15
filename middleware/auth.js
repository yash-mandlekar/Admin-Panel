const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/adminModels/userModel");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isAuthUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("You are not authenticated", 401));
  }
  // console.log(token);
  const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
// console.log(decodetoken);
  req.user = await User.findById(decodetoken.id);
  next();
});
