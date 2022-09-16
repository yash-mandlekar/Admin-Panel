const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const AppUser = require("../models/userModels/appUserModel");
const catchAsyncErrors = require("./catchAsyncErrors");

exports.isLoggedin = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return next(new ErrorHandler("You are not authenticated", 401));
  }
  // console.log(token);
  const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decodetoken);
  req.user = await AppUser.findById(decodetoken.id);
//   console.log(req.user)
   next();
});