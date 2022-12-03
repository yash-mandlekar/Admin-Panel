const User = require("../../models/adminModels/userModel");
const Shorts = require("../../models/adminModels/shortsModel");
const Folders = require("../../models/adminModels/folderModel");
const Channel = require("../../models/adminModels/channelModel");
const Category = require("../../models/adminModels/categoryModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const fs = require("fs");
const ErrorHandler = require("../../utils/ErrorHandler");
const { findOne } = require("../../models/adminModels/channelModel");

exports.UploadShorts = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("parent");
    const { title, folderId, fileType, channels, category } = req.body;
    const folder = await Folders.findOne({ _id: folderId });

    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return Buffer.from(bitmap).toString("base64");
    }

    // console.log(base64);

    const file = base64_encode(req.file.path);

    // const file = (`./public/shorts/${user._id}/${folder.folderName}/${req.file.filename}`,base64_encode(req.file.path));

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
  await User.findOneAndUpdate(
    { _id: user._id },
    { $pull: { shorts: shorts._id } }
  );
  //find one and delete shorts from folder shorts array
  await Folders.findOneAndUpdate(
    { _id: shorts.folderId },
    { $pull: { shorts: shorts._id } }
  );
  //find one and delete shorts from category shorts array
  await Category.findOneAndUpdate(
    { _id: shorts.category },
    { $pull: { shorts: shorts._id } }
  );
  //find one and delete shorts from channel shorts array
  await Channel.findOneAndUpdate(
    { _id: shorts.channels },
    { $pull: { shorts: shorts._id } }
  );
  //delete shorts from database
  await Shorts.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true });
});

exports.UpdateShorts = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
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
  if (req.file) {
    fs.unlink(
      `./public/shorts/${
        shorts.file.split("/")[shorts.file.split("/").length - 1]
      }`,
      (err) => {
        if (err) {
          res.status(500);
        }
      }
    );
    const file = `./public/shorts/${user._id}/${req.body.folderName}/${req.file.filename}`;
    shorts.file = file;
    shorts.fileType = req.body.fileType
      ? req.body.fileType
      : req.file.mimetype.split("/")[0];
  }
  const { title, channels, category } = req.body;
  shorts.title = title;
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

// exports.ApproveShorts = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findOne({ _id: req.user.id }).populate([
//     { path: "parent", populate: { path: "requests" } },
//     { path: "requests" },
//   ]);
//   const shorts = await Shorts.findById(req.params.id);
//   if (!shorts) return next(new ErrorHandler("Shorts not found", 404));
//   if (user.role.toLowerCase() !== "admin") {
//     user.requests.splice(user.requests.indexOf(shorts._id), 1);
//     await user.save();
//     user.parent.requests.push(shorts._id);
//     await user.parent.save();
//   } else {
//     user.requests.splice(user.requests.indexOf(shorts._id), 1);
//     await user.save();
//     shorts.approved = true;
//     await shorts.save();
//   }
//   res.status(200).json({
//     success: true,
//     message: "Shorts approved successfully",
//   });
// });
