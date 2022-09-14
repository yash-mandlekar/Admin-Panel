const Folders = require("../models/folderModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");




exports.CreateFolder = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const folder = await Folders.create({
      folderName: req.body.folderName,
      author: user._id,
    });
    user.folders.push(folder._id);
    await user.save();
    res.status(201).json({
      status: "success",
      folder,
    });
  });

  exports.AllFolders = catchAsyncErrors(async (req, res, next) => {
    const folders = await Folders.find();
    res.status(200).json(folders);
  });

  exports.UpdateFolder = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const folder = await Folders.findOneAndUpdate({ _id: req.body.folderId }, req.body);
    if (!folder) return next(new ErrorHandler("Folder not found", 404));
    user.folders.push(folder._id);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Folder updated successfully",
    });
  });

  exports.DeleteFolder = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { folderId } = req.body;
    // console.log(folderId);
    const folder = await Folders.findOne({ _id: folderId });
    const index = user.folders.indexOf(folderId);
    user.folders.splice(index, 1);
    await user.save();
    await folder.remove();
    res.status(201).json(folder);
  });

  exports.OpenFolder = catchAsyncErrors(async (req, res, next) => {
    const folder = await Folders.findOne({ _id: req.params.id }).populate("news");
    if (!folder) return next(new ErrorHandler("Folder not found", 404));
    res.status(200).json(folder.news);
  });