const User = require("../../models/adminModels/userModel");
const Shorts = require("../../models/adminModels/shortsModel");
const Folders = require("../../models/adminModels/folderModel");
const Channel = require("../../models/adminModels/channelModel");
const Category = require("../../models/adminModels/categoryModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const fs = require("fs");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.UploadShorts = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("parent");
    const { title, folderId, fileType, channels, category } = req.body;
    const folder = await Folders.findOne({ _id: folderId });

    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return Buffer.from(bitmap).toString("base64");
    }

    const file = base64_encode(req.file.path);

    const shorts = await Shorts.create({
      title,
      channels: channels.length > 27 ? channels.split(",") : channels,
      category: category.length > 27 ? category.split(",") : category,
      file: file,
      fileType: fileType ? fileType : req.file.mimetype.split("/")[0],
      author: user._id,
      folderId: folder._id,
      approved: user.role.toLowerCase() === "admin" ? true : false,
    });

    const categories = await Category.find({ _id: { $in: category } });
    categories.forEach((cat) => {
      cat.shorts.push(shorts._id);
      cat.save();
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
  const shorts = await Shorts.findById(req.params.id);
  if (!shorts) {
    return next(new ErrorHandler("Shorts not found", 404));
  }
  user.shorts = user.shorts.filter((item) => item.toString() !== shorts._id);
  await user.save();
  const folder = await Folders.findById(shorts.folderId);
  folder.shorts = folder.shorts.filter(
    (item) => item.toString() !== shorts._id
  );
  await folder.save();
  const categories = await Category.find({ _id: { $in: shorts.category } });
  categories.forEach((cat) => {
    cat.shorts = cat.shorts.filter((item) => item.toString() !== shorts._id);
    cat.save();
  });
  await shorts.remove();
  res.status(200).json({ success: true });
});

exports.UpdateShorts = catchAsyncErrors(async (req, res, next) => {
  const shorts = await Shorts.findOne({ _id: req.params.id });
  if (!shorts) {
    return next(new ErrorHandler("Shorts not found", 404));
  }

  if (shorts.category.toString() !== req.body.category.toString()) {
    const category = await Category.findOne({ _id: req.body.category });
    category.shorts.push(shorts._id);
    await category.save();
  }
  if (shorts.channels.toString() !== req.body.channels.toString()) {
    const channel = await Channel.findOne({ _id: req.body.channels });
    channel.shorts.push(shorts._id);
    await channel.save();
  }
  if (shorts.folderId.toString() !== req.body.folderId.toString()) {
    const folder = await Folders.findOne({ _id: req.body.folderId });
    folder.shorts.push(shorts._id);
    await folder.save();
  }

  function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString("base64");
  }

  const file = base64_encode(req.file.path);

  const { title, channels, category } = req.body;
  shorts.title = title;
  shorts.file = file;
  shorts.channels = channels.length > 27 ? channels.split(",") : channels;
  shorts.category = category.length > 27 ? category.split(",") : category;
  await shorts.save();
  res.status(201).json(shorts);
});

exports.AllShorts = catchAsyncErrors(async (req, res, next) => {
  const shorts = await Shorts.find().populate("channels author category");
  res.status(200).json(shorts);
});

exports.SingleShorts = catchAsyncErrors(async (req, res, next) => {
  const shorts = await Shorts.findById(req.params.id).populate(
    "channels category author"
  );
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
