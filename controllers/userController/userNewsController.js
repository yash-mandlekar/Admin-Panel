const User = require("../../models/userModels/appUserModel");
const UserNews = require("../../models/userModels/userNewsModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const fs = require("fs");
const { log } = require("console");

// @desc    Create User News
exports.CreateUserNews = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { message, fileType } = req.body;

    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return Buffer.from(bitmap).toString("base64");
    }

    const file = base64_encode(req.file.path);

    const userNews = await UserNews.create({
      message,
      fileType: fileType ? fileType : req.file.mimetype.split("/")[0],
      file: file,
      author: user._id,
    });

    res.status(200).json({
      success: true,
      userNews,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get User News
exports.GetUserNews = catchAsyncErrors(async (req, res, next) => {
  try {
    const userNews = await UserNews.find().populate("author");

    res.status(200).json({
      success: true,
      userNews,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get User News By Id
exports.GetUserNewsById = catchAsyncErrors(async (req, res, next) => {
  try {
    const userNews = await UserNews.findById(req.params.id).populate("author");

    res.status(200).json({
      success: true,
      userNews,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update User News
exports.UpdateUserNews = catchAsyncErrors(async (req, res, next) => {
  const userNews = await UserNews.findOne({_id:req.params.id});
if(!userNews){
    return next(new ErrorHandler("User News Not Found", 404));
}
if(req.file){
    function base64_encode(file) {
        var bitmap = fs.readFileSync(file);
        return Buffer.from(bitmap).toString("base64");
      }
      const file = base64_encode(req.file.path);
  
      userNews.file = file;
      userNews.fileType = req.file.mimetype.split("/")[0];
}

userNews.message = req.body.message;
await userNews.save();
res.status(200).json({
    success: true,
    userNews,
    });
});



// @desc    Delete User News
exports.DeleteUserNews = catchAsyncErrors(async (req, res, next) => {
  try {
    const userNews = await UserNews.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User News Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
});
