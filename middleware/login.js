const ErrorHandler = require("../utils/ErrorHandler");
const jwt = require("jsonwebtoken");
const AppUser = require("../models/userModels/appUserModel");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isLoggedin = catchAsyncErrors(async (req, res, next) => {
  // const { token } = req.cookies;
  const { token } = req.headers;
  if (!token) {
    return next(new ErrorHandler("You are not authenticated", 401));
  }
  const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await AppUser.findById(decodetoken.id);
   next();
});