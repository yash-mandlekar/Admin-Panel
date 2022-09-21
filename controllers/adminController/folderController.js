const Folders = require("../../models/adminModels/folderModel");
const User = require("../../models/adminModels/userModel");
const News = require("../../models/adminModels/newsModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const fs = require("fs");

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
  const folders = await Folders.find().populate("author");
  res.status(200).json(folders);
});

exports.UpdateFolder = catchAsyncErrors(async (req, res, next) => {
  const folder = await Folders.findOneAndUpdate(
    { _id: req.body.folderId },
    req.body
  );
  if (!folder) return next(new ErrorHandler("Folder not found", 404));
  res.status(200).json({
    success: true,
    message: "Folder updated successfully",
  });
});

exports.DeleteFolder = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { folderId } = req.body;
  const folder = await Folders.findOne({ _id: folderId });
  const news = await News.find({ _id: { $in: folder.news } });
  await News.deleteMany({ _id: { $in: folder.news } });
  news.forEach((item) => {
    fs.unlink(`./public/folders/${item.file.split("/")[2]}`, (err) => {
      if (err) {
      }
    });
  });
  const index = user.folders.indexOf(folderId);
  user.folders.splice(index, 1);

  await user.save();
  await folder.remove();
  res.status(201).json(folder);
});

exports.OpenFolder = catchAsyncErrors(async (req, res, next) => {
  const folder = await Folders.findOne({ _id: req.params.id }).populate({
    path: "news",
    populate: { path: "channels", select: "channelName" },
    populate: { path: "author", select: "username" },
  });
  if (!folder) return next(new ErrorHandler("Folder not found", 404));
  res.status(200).json(folder);
});
