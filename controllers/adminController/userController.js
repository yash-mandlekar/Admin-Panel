const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const useToken = require("../../utils/useToken");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const User = require("../../models/adminModels/userModel");
// const fs = require("fs"); // File System
const ErrorHandler = require("../../utils/ErrorHandler");
// const { constants } = require("fs/promises");

exports.GetHomepage = (req, res, next) => {
  res.status(200).json({ message: "Welcome to the homepage" });
};

exports.PostRegisterUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.create(req.body);
  if(user.role.toLowerCase() === "senior editor"){
    admin.child.push(user._id);
    await admin.save();
  }else{
    const parent = await User.findById(req.body.parentId);
    parent.child.push(user._id);
    await parent.save();
  }


res.json({ message: "User created successfully", user });
});

exports.PostLoginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  const usercomp = await User.findOne({ email }).select("+password");
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }

  const isPasswordMatching = await usercomp.comparePassword(password);

  if (!isPasswordMatching) {
    return next(new ErrorHandler("Incorrect email or password", 400));
  }

  useToken(user, 200, res);
});

exports.PostRefreshToken = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new ErrorHandler("Your are not authenticated", 401));
  }

  jwt.verify(token, process.env.REFRESH_SECRET, async (err, user) => {
    if (err) {
      return next(new ErrorHandler("Your are not authenticated", 401));
    }
    const refresh_user = await User.findById(user.id);
    useToken(refresh_user, 200, res);
  });
});

exports.LogoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

exports.ForgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }

  const resetToken = user.createPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `http://localhost:4000/user/reset/${resetToken}`;

  const message = `Password reset token is ${resetPasswordUrl}`;

  try {
    // email sending logic goes here
    res.status(200).json({
      status: "success",
      message,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Error in reset token", 500));
  }
});

exports.ResetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPaswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPaswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Invalid Password Token or Token has been expired", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  useToken(user, 200, res);
});

exports.ChangePassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const { password, newPassword, email } = req.body;
    const User = await userModel.findOne({ email }).select("+password").exec();
    if (!User) return res.status(401).send("User not found.");
    const matchpassword = comparepassword(password, User.password);
    if (!matchpassword) return res.status(401).send("Incorrect Password.");

    User.password = hashPassword(newPassword);
    await User.save();
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

exports.GetUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
});

exports.GetEditor = catchAsyncErrors(async (req, res, next) => {
  const user = (await User.find()).filter((user) => user.role.toLowerCase() === "editor");
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.GetAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = (await User.find()).filter((user) => user.role.toLowerCase() === "admin");
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.GetSeniorEditor = catchAsyncErrors(async (req, res, next) => {
  const user = (await User.find()).filter((user) => user.role.toLowerCase() === "senior editor");
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.GetReporter = catchAsyncErrors(async (req, res, next) => {
  const user = (await User.find()).filter((user) => user.role.toLowerCase() === "reporter");
  res.status(200).json({
    status: "success",
    data: user,
  });
});


exports.UpdateProfilePic = catchAsyncErrors(async (req, res, next) => {
  const {profileImage,userId, fileType } = req.body;
  const user = await AppUser.findOne({ _id: userId });
  if (user.profileImage.split("/")[2] !== profileImage) {
      fs.unlink(`./public/profilePics/${user.profileImage.split("/")[2]}`, (err) => {
          if (err) {
          }
      });
  }
  user. profileImage = `/profilePics/${req.file.filename}`;
  console.log(`/profilePics/${req.file.filename}`);
  user.fileType= fileType ? fileType : req.file.mimetype.split("/")[0];
  await user.save();
  res.status(201).json({
  success: true,
  message: "Image updated successfully",
  user
});


});


exports.RemoveUser = catchAsyncErrors(async (req, res, next) => {
 const user = await User.findById(req.user.id);
 if(user.role.toLowerCase() !=="admin"){
   return next(new ErrorHandler("You are not authorized to perform this action", 401));
 }
  const user2 = await User.findById(req.body.user2);
  if (!user2) {
    return next(new ErrorHandler("User not found", 404));
  }
  await user2.remove();
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
  });
}); 



























