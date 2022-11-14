const NewsCategory = require("../../models/adminModels/newsCategoryModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");

exports.CreateNewsCategory = catchAsyncErrors(async (req, res, next) => {
  const {
    parentCategory,
    icon,
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
  const newsCategory = await NewsCategory.create({
    parentCategory: parentCategory.length > 0 ? parentCategory : null,
    sortOrder,
    icon: `folders/${req.file.filename}`,
    showInMenu,
    showInChild,
    englishName,
    hindiName,
    startingAlphabet,
    categoryUrl,
    metaTitle,
    metaDescription,
  });
  console.log(req.file.filename);

  if (parentCategory.length > 0) {
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
  const newsCategory = await NewsCategory.findOne({ _id: req.params.id });
  if (!newsCategory) {
    return next(new ErrorHandler("NewsCategory not found", 404));
  }
  res.status(200).json(newsCategory);
});

exports.UpdateNewsCategory = catchAsyncErrors(async (req, res, next) => {
  const newsCategory = await NewsCategory.findById(req.params.id);
  if (!newsCategory) {
    return next(new ErrorHandler("NewsCategory not found", 404));
  }
  newsCategory.parentCategory = req.body.parentCategory;
  newsCategory.icon = `folders/${req.file.filename}`;
  newsCategory.sortOrder = req.body.sortOrder;
  newsCategory.showInMenu = req.body.showInMenu;
  newsCategory.showInChild = req.body.showInChild;
  newsCategory.englishName = req.body.englishName;
  newsCategory.hindiName = req.body.hindiName;
  newsCategory.startingAlphabet = req.body.startingAlphabet;
  newsCategory.categoryUrl = req.body.categoryUrl;
  newsCategory.metaTitle = req.body.metaTitle;
  newsCategory.metaDescription = req.body.metaDescription;
  await newsCategory.save();
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
