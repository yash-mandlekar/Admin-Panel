const User = require("../../models/adminModels/userModel");
const News = require("../../models/adminModels/newsModel");
const Folders = require("../../models/adminModels/folderModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const fs = require("fs");
const ErrorHandler = require("../../utils/ErrorHandler");


exports.UploadNews = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { title, description, folderId, filetype } = req.body;
    const folder = await Folders.findOne({ _id: folderId });
    const news = await News.create({
        title,
        description,
        file: `./folders/${req.file.filename}`,
        fileType: filetype ? filetype : req.file.mimetype.split("/")[0],
        author: user._id,
    });
    folder.news.push(news._id);
    await folder.save();
    user.news.push(news._id);
    await user.save();
    res.status(201).json(news);

});

exports.DeleteNews = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { newsId, folderId } = req.body;
    const folder = await Folders.findOne({ _id: folderId });
    const news = await News.findOne({ _id: newsId });
    fs.unlink(`./public/folders/${news.file.split("/")[2]}`, (err) => {
        if (err) {
        }
    });
    const index = folder.news.indexOf(newsId);
    folder.news.splice(index, 1);
    user.news.splice(user.news.indexOf(newsId), 1);
    await folder.save();
    await user.save();
    await news.remove();
    res.status(201).json({
        success: true,
        message: "News deleted successfully",
    });
});


exports.UpdateNews = catchAsyncErrors(async (req, res, next) => {
    const { newsId, folderId } = req.body;
    const folder = await Folders.findOne({ _id: folderId });
    const news = await News.findOneAndUpdate({ _id: newsId }, {
        title: req.body.title,
        description: req.body.description,        
    });
    if (!news) return next(new ErrorHandler("News not found", 404));
    folder.news.push();
    await folder.save();
    res.status(200).json({
        success: true,
        message: "News updated successfully",
    });
}
);

exports.AllNews = catchAsyncErrors(async (req, res, next) => {
    const news = await News.find();
    res.status(200).json(news);
});

exports.SingleNews = catchAsyncErrors(async (req, res, next) => {
    const news = await News.findById(req.body.newsId);
    if (!news) return next(new ErrorHandler("News not found", 404));
    res.status(200).json(news);
});
