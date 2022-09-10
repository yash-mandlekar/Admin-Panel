const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const useToken = require("../utils/useToken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const News = require("../models/newsModel");
const Folders = require("../models/folderModel");
const fs = require("fs"); // File System
const ErrorHandler = require("../utils/ErrorHandler");
const { constants } = require("fs/promises");

exports.GetHomepage = (req, res, next) => {
  res.status(200).json({ message: "Welcome to the homepage" });
};

exports.PostRegisterUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.create(req.body);
  useToken(user, 201, res);
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


exports.CreateFolder = catchAsyncErrors(async (req, res, next) => {
  console.log(req.cookies);
  console.log(req.user);
  const { folderName } = req.body;
  fs.mkdir(`./public/folders/${folderName}`, (err) => {
    if (err) throw err;
  });
  const folder = new Folders({
    folderName,
    author: req.user.id,
  });
  await folder.save();
  res.status(201).json(folder);
});

exports.UploadNews = catchAsyncErrors(async (req, res, next) => {
  const { title, discription, category } = req.body;
  const folder = await Folders.findOne({ _id: req.params.folderId });
  if (req.file.mimetype !== "image/jpeg" && req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpg" && req.file.mimetype !== "image/gif" && req.file.mimetype !== "image/svg+xml" && req.file.mimetype !== "image/webp" && req.file.mimetype !== "video/mp4" && req.file.mimetype !== "video/X-flv" && req.file.mimetype !== "application/x-mpegURL" && req.file.mimetype !== "audio/x-wav" && req.file.mimetype !== "audio/mpeg" && req.file.mimetype !== "audio/mpeg" && req.file.mimetype !== "	audio/mp4") {
    res.json({ message: "File type not supported" });
  }
  else {
    const news = new News({
      title,
      discription,
      category,
      file: {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype
      }
    });
    console.log(req.file.path);
    await news.save();
    res.status(201).json(news);
  }
});

exports.AllFolders = catchAsyncErrors(async (req, res, next) => {
  const folders = await Folders.find();
  res.status(200).json(folders);
});


exports.DeleteFolder = catchAsyncErrors(async (req, res, next) => {

  const folder = await Folders.findById(req.params.id);
  if (!folder) {
    return next(new ErrorHandler("Folder not found", 404));
  }
  await folder.remove();
  fs.unlink(`./public/folders/${req.params.folderName}`, (err) => {
    if (err) throw err;
  });

  res.status(200).json({
    success: true,
    message: "Folder deleted successfully",
  });
});


exports.UpdateFolder = catchAsyncErrors(async (req, res, next) => {
  const folder = await Folders.findById(req.params.folderName);
  if (!folder) {
    return next(new ErrorHandler("Folder not found", 404));
  }
  folder.folderName = req.body.folderName;
  await folder.save();
  res.status(200).json({
    success: true,
    message: "Folder updated successfully",
  });
});

exports.OpenFolder = catchAsyncErrors(async (req, res, next) => {
  const folder = await Folders.findById(req.params.id).populate("news");
  if (!folder) {
    return next(new ErrorHandler("Folder not found", 404));
  }
  res.status(200).json(folder);
});


