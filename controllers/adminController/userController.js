const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const useToken = require("../../utils/useToken");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const User = require("../../models/adminModels/userModel");
const AppUsers = require("../../models/userModels/appUserModel");
const fs = require("fs"); // File System
const ErrorHandler = require("../../utils/ErrorHandler");
const { populate } = require("../../models/adminModels/channelModel");
// const { constants } = require("fs/promises");
const { mailer } = require("../../middleware/nodeMailer");

exports.GetHomepage = (req, res, next) => {
  res.status(200).json({ message: "Welcome to the homepage" });
};

exports.PostRegisterAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    message: "Admin created successfully",
    user,
  });
});

exports.PostRegisterUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (user.role.toLowerCase() === "senior editor") {
      const admin = await User.findById(req.user.id);
      admin.child.push(user._id);
      await admin.save();
      user.parent = admin._id;
      await user.save();
    } else {
      const parent = await User.findById(req.body.parentId);
      parent.child.push(user._id);
      await parent.save();
      user.parent = parent._id;
      await user.save();
    }
    res.json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
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

  if (user.isBlocked === true) {
    return next(
      new ErrorHandler("User is blocked kindly contact with admin", 400)
    );
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
    const refresh_user = await User.findOne({ _id: user.id }).populate({
      path: "requests",
      populate: [{ path: "author" }],
    });
    if (refresh_user) {
      useToken(refresh_user, 200, res);
    }else{
      return next(new ErrorHandler("Your are not authenticated", 401));
    }
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
    const details = {
      email: user.email,
      subject: "Password Reset",
      message: message,
    };

    await mailer(details);

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    return err;
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
    const { password, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!(await user.comparePassword(password))) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }
    user.password = newPassword;
    await user.save();
    useToken(user, 200, res);
  } catch (error) {
    next(error);
  }
});

exports.GetUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  const appUsers = await AppUsers.find();
  res.status(200).json({
    status: "success",
    users,
    appUsers,
  });
});

exports.SingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate("child");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.GetEditor = catchAsyncErrors(async (req, res, next) => {
  const user = (await User.find()).filter(
    (user) => user.role.toLowerCase() === "editor"
  );
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.GetAdmin = catchAsyncErrors(async (req, res, next) => {
  const user = (await User.find()).filter(
    (user) => user.role.toLowerCase() === "admin"
  );
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.GetSeniorEditor = catchAsyncErrors(async (req, res, next) => {
  const user = (await User.find()).filter(
    (user) => user.role.toLowerCase() === "senior editor"
  );
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.GetReporter = catchAsyncErrors(async (req, res, next) => {
  const user = (await User.find()).filter(
    (user) => user.role.toLowerCase() === "reporter"
  );
  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.UpdateProfilePic = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString("base64");
  }
  const file = base64_encode(req.file.path);
  user.profileImage = file;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Profile picture updated successfully",
  });
});

exports.RemoveUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role.toLowerCase() !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to perform this action", 401)
    );
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

exports.BlockUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role.toLowerCase() !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to perform this action", 401)
    );
  }
  const user2 = await User.findById(req.body.user2);

  if (!user2) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user2.isBlocked) {
    user2.isBlocked = false;
  } else {
    user2.isBlocked = true;
  }
  await user2.save();
  res.status(200).json({
    status: "success",
  });
});

exports.BlockAppUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role.toLowerCase() !== "admin") {
    return next(
      new ErrorHandler("You are not authorized to perform this action", 401)
    );
  }
  const user2 = await AppUsers.findById(req.body.user2);
  if (!user2) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (user2.isBlocked) {
    user2.isBlocked = false;
  } else {
    user2.isBlocked = true;
  }
  await user2.save();
  res.status(200).json({
    status: "success",
  });
});

exports.UpdateUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.GetLive = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const live = await post.find();
  res.status(200).json({
    status: "success",
    live,
  });
});
