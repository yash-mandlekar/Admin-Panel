const User = require("../../models/adminModels/userModel");
const News = require("../../models/adminModels/newsModel");
const Categories = require("../../models/adminModels/newsCategoryModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const { file } = require("googleapis/build/src/apis/file");
const fs = require("fs");

// upload news and find category with array of category id and push news id in category news array and save category and news and return news
exports.UploadNews = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("parent");
    const {
      metaTitle,
      shortDescription,
      metaDescription,
      description,
      location,
      showInSlider,
      sliderPrority,
      publishDate,
      latestNews,
      latestNewsPriority,
      aboutImage,
      imageSource,
      categories,
      hashTags,
      fileType,
    } = req.body;

    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return Buffer.from(bitmap).toString("base64");
    }

    const file = base64_encode(req.file.path);

    const news = await News.create({
      metaTitle,
      shortDescription,
      metaDescription,
      description,
      location,
      showInSlider,
      sliderPrority,
      publishDate,
      latestNews,
      file: file,
      latestNewsPriority,
      aboutImage,
      imageSource,
      categories,
      newsUrl: metaTitle.split(" ").join("-"),
      hashTags,
      fileType: fileType ? fileType : req.file.mimetype.split("/")[0],
    });

    const category = await Categories.find({ _id: { $in: categories } });
    category.forEach((cat) => {
      cat.news.push(news._id);
      cat.save();
    });
    if(user.role.toLowerCase() !== "admin"){
      user.parent.requests.push(news._id);
      await user.parent.save();
    }
    user.news.push(news._id);
    await user.save();
    res.status(201).json(news);
  } catch (err) {
    fs.unlinkSync(req.file.path);
    next(err);
  }
});


exports.UpdateNews = catchAsyncErrors(async (req, res, next) => {
  const news = await News.findOne({ _id: req.params.id });
  if (!news) {
    return next(new ErrorHandler("News not found", 404));
  }
  if (news.categories.toString() !== req.body.categories.toString()) {
    const categories = await Categories.findOne({ _id: req.body.categories });
    categories.news.push(news._id);
    await categories.save();
  }
  function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString("base64");
  }
  const file = base64_encode(req.file.path);

  news.metaTitle = req.body.metaTitle;
  news.shortDescription = req.body.shortDescription;
  news.metaDescription = req.body.metaDescription;
  news.description = req.body.description;
  news.location = req.body.location;
  news.showInSlider = req.body.showInSlider;
  news.sliderPrority = req.body.sliderPrority;
  news.publishDate = req.body.publishDate;
  news.latestNews = req.body.latestNews;
  news.latestNewsPriority = req.body.latestNewsPriority;
  news.aboutImage = req.body.aboutImage;
  news.imageSource = req.body.imageSource;
  news.newsUrl = req.body.newsUrl;
  news.categories = req.body.categories;
  news.hashTags = req.body.hashTags;
  news.fileType = req.body.fileType;
  news.file = file;
  news.save();
  res.status(200).json({
    success: true,
    news,
  });
});

exports.DeleteNews = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("parent");
  const news = await News.findOne({ _id: req.params.id });
  if (!news) {
    return next(new ErrorHandler("News not found", 404));
  }
  if (user.role.toLowerCase() !== "admin") {
    user.parent.requests = user.parent.requests.filter(
      (item) => item.toString() !== news._id.toString()
    );
    await user.parent.save();
  }
  user.news = user.news.filter(
    (item) => item.toString() !== news._id.toString()
  );
  await user.save();
  // find category from categories array and remove news id from category news array and save category and remove news and return news id and message news deleted successfully
  const category = await Categories.find({ _id: { $in: news.categories } });
  category.forEach((cat) => {
    cat.news = cat.news.filter(
      (item) => item.toString() !== news._id.toString()
    );
    cat.save();
  });
  await news.remove();
  res.status(200).json({
    success: true,
    message: "News deleted successfully",
    newsId: news._id,
  });
});

exports.SingleNews = catchAsyncErrors(async (req, res, next) => {
  const news = await News.findById(req.params.id).populate("categories author");
  if (!news) {
    return next(new ErrorHandler("News not found", 404));
  }
  res.status(200).json(news);
});

exports.AllNews = catchAsyncErrors(async (req, res, next) => {
  const news = await News.find().populate("categories author");
  res.status(200).json(news);
});

exports.ApproveNews = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("parent");
  const news = await News.findOne({ _id: req.params.id });
  if (!news) {
    return next(new ErrorHandler("News not found", 404));
  }
  // if user role is admin then set news.approved to true and save it and return news object to client side else if user role is not admin then remove news._id from user.parent.requests and add news._id to user.parent.news and save it and return news object to client side else return error to client side with status code 401 and message "You are not authorized to approve news" and error name "Unauthorized" and error code 401
  if (user.role.toLowerCase() === "admin") {
    news.approved = true;
    await news.save();
    res.status(200).json(news);
  } else if (user.role.toLowerCase() !== "admin") {
    user.parent.requests = user.parent.requests.filter(
      (item) => item.toString() !== news._id.toString()
    );
    user.parent.news.push(news._id);
    await user.parent.save();
    res.status(200).json(news);
  } else {
    return next(
      new ErrorHandler(
        "You are not authorized to approve news",
        401,
        "Unauthorized",
        401
      )
    );
  }
});

exports.GetNewsByCategoryName = catchAsyncErrors(async (req, res, next) => {
  const category = await Categories.findOne({ categoryUrl: req.params.name }).populate(
    "news"
  );
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }
  const { news } = category;
  res.status(200).json(news);
});

exports.GetNewsByCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Categories.findById({ _id: req.params.id }).populate("news");
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }
  const { news } = category;
  res.status(200).json(news);
});

exports.GetNewsByAuthor = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id }).populate("news");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const { news } = user;
  res.status(200).json(news);
});

exports.GetNewsByDate = catchAsyncErrors(async (req, res, next) => {
  const news = await News.find({ date: req.params.date });
  res.status(200).json(news);
});

exports.GetNewsByLocation = catchAsyncErrors(async (req, res, next) => {
  const news = await News.find({ location: req.params.location });
  res.status(200).json(news);
});

exports.GetNewsByHashTag = catchAsyncErrors(async (req, res, next) => {
  const news = await News.find({ hashtag: req.params.hashTag });
  res.status(200).json(news);
});
