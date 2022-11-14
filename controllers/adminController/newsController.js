const User = require("../../models/adminModels/userModel");
const News = require("../../models/adminModels/newsModel");
const Categories = require("../../models/adminModels/newsCategoryModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");


// upload news and find category with array of category id and push news id in category news array and save category and news and return news
exports.UploadNews = catchAsyncErrors(async (req, res, next) => {
try{
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
      newsUrl,
      categories,
      hashTags,
      fileType,
    } = req.body;
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
      latestNewsPriority,
      aboutImage,
      imageSource,
      newsUrl,
      categories,
      hashTags,
      fileType,
    });
    const category = await Categories.find({ _id: { $in: categories } });
    category.forEach((cat) => {
      cat.news.push(news._id);
      cat.save();
    });
    news.author = user._id;
    news.save();
    res.status(200).json({
      success: true,
      news,
    });
  }catch(err){
    next(err);
  }
});

exports.UpdateNews = catchAsyncErrors(async (req, res, next) => {
  const {
    newsId,
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
    newsUrl,
    categories,
    hashTags,
    fileType,
  } = req.body;
  const news = await News.findOne({ _id: newsId });
  // if news.categories is not equal to categories then remove news._id from news.categories.news and add news._id to categories.news
  if (news.categories.toString() !== categories) {
    const oldCategory = await Categories.findOne({ _id: news.categories });
    const newCategory = await Categories.findOne({ _id: categories });
    oldCategory.news = oldCategory.news.filter(
      (item) => item.toString() !== news._id.toString()
    );
    newCategory.news.push(news._id);
    await oldCategory.save();
    await newCategory.save();
  }
  news.file = `/folders/${req.file.filename}`;
  news.metaTitle = metaTitle;
  news.shortDescription = shortDescription;
  news.metaDescription = metaDescription;
  news.description = description;
  news.location = location;
  news.showInSlider = showInSlider;
  news.sliderPrority = sliderPrority;
  news.publishDate = publishDate;
  news.latestNews = latestNews;
  news.latestNewsPriority = latestNewsPriority;
  news.aboutImage = aboutImage;
  news.imageSource = imageSource;
  news.newsUrl = newsUrl;
  news.categories = categories;
  news.hashTags = hashTags.length > 27 ? hashTags.split(",") : hashTags;
  news.fileType = fileType ? fileType : req.file.mimetype.split("/")[0];
  await news.save();
  res.status(200).json(news);
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
  const category = await Categories.findOne({ _id: news.categories });
  category.news = category.news.filter(
    (item) => item.toString() !== news._id.toString()
  );
  await category.save();
  await news.remove();
  res.status(200).json({ success: true });
});

exports.SingleNews = catchAsyncErrors(async (req, res, next) => {
  const news = await News.findById(req.params.id).populate("categories");
  if (!news) {
    return next(new ErrorHandler("News not found", 404));
  }
  res.status(200).json(news);
});

exports.AllNews = catchAsyncErrors(async (req, res, next) => {
  const news = await News.find().populate("categories");
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

exports.GetNewsByCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Categories.findById({ _id: req.params.id });
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }
  const news = await News.find({ categories: category._id });
  res.status(200).json(news);
});

exports.GetNewsByAuthor = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const news = await News.find({ author: user._id });
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
