const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const axios = require("axios");
const useToken = require("../../utils/useToken");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const AppUser = require("../../models/userModels/appUserModel");
const Otp = require("../../models/userModels/otpModel");
const fs = require("fs"); // File System
const ErrorHandler = require("../../utils/ErrorHandler");
const { populate } = require("../../models/userModels/appUserModel");
const { generateToken04 } = require("./Zego");
// const { constants } = require("fs/promises");

exports.GetHomepage = (req, res, next) => {
  res.status(200).json({ message: "Welcome to the homepage" });
};

exports.PostRegisterAppUser = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.create(req.body);
  res.json({ message: "User created successfully", user });
});

exports.PostLoginAppUser = catchAsyncErrors(async (req, res, next) => {
  const apiKey = process.env.API_Key;
  const phone = req.body.phone;
  const message = "Your One Time Password (OTP) for online class is ";
  var val = Math.floor(1000 + Math.random() * 9000);
  const otp = val.toString();
  const oldOtp = await Otp.findOne({
    phone: phone,
  });
  if (oldOtp) {
    await Otp.findByIdAndDelete(oldOtp._id);
  }
  // save otp to database
  const otpData = new Otp({
    phone: phone,
    otp: otp,
  });
  axios.post(
    `http://msg.websoftvalley.com/V2/http-api.php?apikey=${apiKey}number=${phone}&message=${message}${otp}.&format=json`
  );

  // bcrypt otp and save to database
  const salt = await bcrypt.genSalt(10); //bcrypt is used to hash the password
  otpData.otp = await bcrypt.hash(otpData.otp, salt); //hashing the password
  otpData.save().then((result) => {
    res.status(200).json({
      message: "OTP sent successfully",
    });
  });
});

exports.postVerifyOtp = catchAsyncErrors(async (req, res, next) => {
  //verify otp and login user if otp is correct and save user to database if user does not exist in database already and login user if user exists in database already and otp is correct and send error if otp is incorrect
  const phone = req.body.phone;
  const otp = req.body.otp;
  const user = await AppUser.findOne({ phone: phone });
  if (!user) {
    const otpData = await Otp.findOne({ phone: phone });
    if (!otpData) {
      return next(new ErrorHandler("OTP does not exist", 400));
    }
    const isMatch = await bcrypt.compare(otp, otpData.otp);
    if (!isMatch) {
      return next(new ErrorHandler("OTP is incorrect", 400));
    }
    const newUser = await AppUser.create(req.body);
    useToken(newUser, 200, res);
  } else {
    const otpData = await Otp.findOne({ phone: phone });
    if (!otpData) {
      return next(new ErrorHandler("OTP does not exist", 400));
    }
    const isMatch = await bcrypt.compare(otp, otpData.otp);
    if (!isMatch) {
      return next(new ErrorHandler("OTP is incorrect", 400));
    }
    useToken(user, 200, res);
  }
});

exports.PostRefreshAppToken = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.body;

  if (!token) {
    return next(new ErrorHandler("Your are not authenticated", 401));
  }

  jwt.verify(token, process.env.REFRESH_SECRET, async (err, user) => {
    if (err) {
      return next(new ErrorHandler("Your are not authenticated", 401));
    }
    const refresh_user = await AppUser.findById(user.id);
    if (!refresh_user) {
      return next(new ErrorHandler("User does not exist", 400));
    }
    useToken(refresh_user, 200, res);
  });
});

exports.LogoutAppUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

exports.ForgotPasswordApp = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findOne({ phone: req.body.phone });

  if (!user) {
    return next(new ErrorHandler("User does not exist", 400));
  }

  const resetToken = user.createPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `http://localhost:4000/user/reset/${resetToken}`;

  const message = `Password reset token is ${resetPasswordUrl}`;

  try {
    // phone sending logic goes here
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

exports.ResetPasswordApp = catchAsyncErrors(async (req, res, next) => {
  const resetPaswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await AppUser.findOne({
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

exports.ChangePasswordApp = catchAsyncErrors(async (req, res, next) => {
  try {
    const { password, newPassword, phone } = req.body;
    const user = await appUserModel
      .findById(req.user.id)
      .select("+password")
      .exec();
    if (!user) return res.status(401).send("User not found");
    const matchpassword = comparepassword(password, user.password);
    if (!matchpassword) return res.status(401).send("Incorrect Password.");

    user.password = hashPassword(newPassword);
    await user.save();
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

exports.GetAppUser = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.params.id);
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.GetUserByUserName = catchAsyncErrors(async (req, res, next) => {
  // find users from username and return users
  if (req.params.username === "")
    return res.status(200).json({ status: "success", user: [] });
  const user = await AppUser.find({
    userName: { $regex: req.params.username, $options: "i" },
  }).populate("posts");
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.GetSingleUserByUserName = catchAsyncErrors(async (req, res, next) => {
  // find user from username and return user
  if (req.params.username === "")
    return res.status(200).json({ status: "success", user: {} });

  const user = await AppUser.findOne({
    userName: { $regex: req.params.username, $options: "i" },
  }).populate([
    {
      path: "posts",
      populate: {
        path: "likes",
      },
    },
    {
      path: "following",
    },
  ]);
  res.status(200).json({
    status: "success",
    user,
  });
});

exports.UpdateAppUser = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.DeleteAppUser = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.UpdateProfilePic = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
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

exports.DeleteProfilePic = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  user.profileImage = "";
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Profile picture deleted successfully",
  });
});

exports.UpdateCoverPic = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString("base64");
  }

  const file = base64_encode(req.file.path);
  user.coverImage = file;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Cover picture updated successfully",
  });
});

exports.DeleteCoverPic = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  user.coverImage = "";
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Cover picture deleted successfully",
  });
});

exports.FollowRequest = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const followUser = await AppUser.findById(req.params.id);
  if (user.following.includes(req.params.id)) {
    user.following.pop(req.params.id);
    followUser.followers.pop(req.user.id);
    await user.save();
    await followUser.save();
    res.status(200).json({
      status: "success",
      message: "Unfollowed successfully",
    });
  }
  if (followUser.followrequest.includes(req.user.id)) {
    followUser.followrequest.pop(req.user.id);
    await user.save();
    await followUser.save();
    res.status(200).json({
      status: "success",
      message: "Follow request cancelled successfully",
    });
  } else {
    followUser.followrequest.push(req.user.id);
    await user.save();
    await followUser.save();
    res.status(200).json({
      status: "success",
      message: "Follow request sent successfully",
    });
  }
});

exports.FollowRequestAccept = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const followUser = await AppUser.findById(req.params.id); // id of user to follow
  user.followers.push(req.params.id);
  user.followrequest.pop(req.params.id);
  followUser.following.push(req.user.id);
  await user.save();
  await followUser.save();
  res.status(200).json({
    status: "success",
    message: "Follow request accepted successfully",
  });
});

exports.FollowUnfollow = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const followUser = await AppUser.findById(req.params.id); // id of user to follow
  if (user.following.includes(req.params.id)) {
    // return next(new ErrorHandler("You are already following this user", 400));
    user.following.pop(req.params.id);
    followUser.followers.pop(req.user.id);
    await user.save();
    await followUser.save();
    res.status(200).json({
      status: "success",
      message: "Unfollowed successfully",
    });
  } else {
    user.following.push(req.params.id);
    followUser.followers.push(req.user.id);
    await user.save();
    await followUser.save();
    res.status(200).json({
      status: "success",
      user,
      followUser,
      message: "Followed successfully",
    });
  }
});

// appUser intrests
exports.AddInterest = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const { interest } = req.body;
  user.interest = interest;
  await user.save();
  res.status(201).json({
    success: true,
    message: "Interest added successfully",
    user,
  });
});

// PostGoLive
exports.GetZegoToken = catchAsyncErrors(async (req, res, next) => {
  const payloadObject = {
    room_id: "room1",
    privilege: {
      1: 1, // loginRoom: 1 pass , 0 not pass
      2: 0, // publishStream: 1 pass , 0 not pass
    },
    stream_id_list: null,
  };
  const payload = JSON.stringify(payloadObject);
  const token = generateToken04(
    628726461,
    req.params.roomId,
    "7d6974cadc1fa2a0b63946061dcf615a",
    3600,
    payload
  );
  res.status(201).json({
    success: true,
    message: "Live url added successfully",
    token,
  });
});
// PostGoLive
exports.PostGoLive = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  user.live = req.body.url;
  await user.save();
  res.status(201).json({
    success: true,
    message: "Live url added successfully",
  });
});
// GetIsLive
exports.GetIsLive = catchAsyncErrors(async (req, res, next) => {
  // find with username
  const user = await AppUser.findOne({ userName: req.params.username });
  if (user.live.length > 2) {
    res.status(201).json({
      success: true,
      message: "Live url added successfully",
      live: true,
    });
  } else {
    res.status(201).json({
      success: true,
      message: "Live url added successfully",
      live: false,
    });
  }
});

// GetRemoveLive
exports.GetRemoveLive = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  user.live = "";
  await user.save();
  res.status(201).json({
    success: true,
    message: "Live url removed successfully",
  });
});
