const NewsCategory = require("../../models/adminModels/newsCategoryModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
var fs = require("fs");

exports.CreateNewsCategory = catchAsyncErrors(async (req, res, next) => {
  const {
    parentCategory,
    sortOrder,
    showInMenu,
    showInChild,
    englishName,
    hindiName,
    startingAlphabet,
    categoryUrl,
    metaTitle,
    metaDescription,
  } = req.body;

  function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString("base64");
  }

  const icon = base64_encode(req.file.path);
  const newsCategory = await NewsCategory.create({
    parentCategory:
      parentCategory && parentCategory.length > 0 ? parentCategory : null,
    sortOrder,
    icon: icon,
    showInMenu,
    showInChild,
    englishName,
    hindiName,
    startingAlphabet,
    categoryUrl,
    metaTitle,
    metaDescription,
  });
  if (parentCategory && parentCategory.length > 0) {
    const parent = await NewsCategory.findOne({ _id: parentCategory });
    parent.child.push(newsCategory._id);
    await parent.save();
  }

  res.status(200).json({
    status: "success",
    newsCategory,
  });
});

exports.AllNewsCategories = catchAsyncErrors(async (req, res, next) => {
  const newsCategory = await NewsCategory.find().populate("parentCategory");
  res.status(200).json(newsCategory);
});

exports.GetNewsCategory = catchAsyncErrors(async (req, res, next) => {
  const newsCategory = await NewsCategory.findOne({ _id: req.params.id }).populate('news');
  if (!newsCategory) {
    return next(new ErrorHandler("NewsCategory not found", 404));
  }
  res.status(200).json(newsCategory);
});

exports.UpdateNewsCategory = catchAsyncErrors(async (req, res, next) => {
  const newsCategory = await NewsCategory.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  );
  function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString("base64");
  }
  if (req.file) {
    const icon = base64_encode(req.file.path);
    newsCategory.icon = icon;
    await newsCategory.save();
  }
  res.status(200).json({
    status: "success",
    newsCategory,
  });
});

exports.DeleteNewsCategory = catchAsyncErrors(async (req, res, next) => {
  const newsCategory = await NewsCategory.findById(req.params.id);
  if (!newsCategory) {
    return next(new ErrorHandler("NewsCategory not found", 404));
  }
  await newsCategory.remove();
  res.status(200).json({
    status: "success",
    message: "NewsCategory deleted successfully",
  });
});
