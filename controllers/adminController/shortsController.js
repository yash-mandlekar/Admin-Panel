const User = require("../../models/adminModels/userModel");
const Shorts = require("../../models/adminModels/shortsModel");
const Folders = require("../../models/adminModels/folderModel");
const Category = require("../../models/adminModels/categoryModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const fs = require("fs");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.UploadShorts = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("parent");
    const { title,folderId, fileType, channels,category } =
      req.body;
      const folder = await Folders.findOne({ _id: folderId });
      const shorts = await Shorts.create({
        title,
        channels: channels.length > 27 ? channels.split(",") : channels,
        category: category.length > 27 ? category.split(",") : category,
        file: `/folders/${req.file.filename}`,
        fileType: fileType ? fileType : req.file.mimetype.split("/")[0],
        author: user._id,
        folderId: folder._id,
        approved: user.role.toLowerCase() === "admin" ? true : false,
      });
      if (user.role.toLowerCase() !== "admin") {
        user.parent.requests.push(shorts._id);
        await user.parent.save();
      }
    folder.shorts.push(shorts._id);
    await folder.save();
    user.shorts.push(shorts._id);
    await user.save();
    res.status(201).json(shorts);
  } catch (err) {
    fs.unlinkSync(req.file.path);
    next(err);
  }
});

exports.DeleteShorts = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { shortsId, folderId } = req.body;
  const folder = await Folders.findOne({ _id: folderId });
  const shorts = await Shorts.findOne({ _id: shortsId });
  const index = folder.shorts.indexOf(shortsId);
  folder.shorts.splice(index, 1);
  user.shorts.splice(user.shorts.indexOf(shortsId), 1);
  await folder.save();
  await user.save();
  await shorts.remove();
  res.status(201).json({
    success: true,
    message: "Shorts deleted successfully",
  });
});

exports.UpdateShorts = catchAsyncErrors(async (req, res, next) => {
  const { shortsId, title,file, fileType, channels, category } =
    req.body;
  const shorts = await Shorts.findOne({ _id: shortsId });
  shorts.file = `/folders/${req.file.filename}`;

  shorts.title = title;
  shorts.channels = channels.length > 27 ? channels.split(",") : channels;
  shorts.category = category.length > 27 ? category.split(",") : category;
  shorts.fileType = fileType ? fileType : req.file.mimetype.split("/")[0];
  await shorts.save();
  res.status(200).json({
    success: true,
    message: "Shorts updated successfully",
    shorts,
  });
});

exports.AllShorts = catchAsyncErrors(async (req, res, next) => {
  const shorts = await Shorts.find().populate("channels author category");
  res.status(200).json(shorts);
});

exports.SingleShorts = catchAsyncErrors(async (req, res, next) => {
  const shorts = await Shorts.findById(req.params.id).populate("channels category author");
  if (!shorts) return next(new ErrorHandler("Shorts not found", 404));
  res.status(200).json(shorts);
});

exports.ApproveShorts = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id }).populate([
    { path: "parent", populate: { path: "requests" } },
    { path: "requests" },
  ]);
  const shorts = await Shorts.findById(req.params.id);
  if (!shorts) return next(new ErrorHandler("Shorts not found", 404));
  if (user.role.toLowerCase() !== "admin") {
    user.requests.splice(user.requests.indexOf(shorts._id), 1);
    await user.save();
    user.parent.requests.push(shorts._id);
    await user.parent.save();
  } else {
    user.requests.splice(user.requests.indexOf(shorts._id), 1);
    await user.save();
    shorts.approved = true;
    await shorts.save();
  }
  res.status(200).json({
    success: true,
    message: "Shorts approved successfully",
  });
});
