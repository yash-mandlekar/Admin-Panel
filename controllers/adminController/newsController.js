const User = require("../../models/adminModels/userModel");
const News = require("../../models/adminModels/newsModel");
const Folders = require("../../models/adminModels/folderModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const fs = require("fs");
const ErrorHandler = require("../../utils/ErrorHandler");


exports.UploadNews = catchAsyncErrors(async (req, res, next) => {
    try{
    const user = await User.findById(req.user.id);
    const { title, description, folderId, fileType, channels } = req.body;
    const folder = await Folders.findOne({ _id: folderId });
    const news = await News.create({
        title,
        description,
        channels:channels.length > 27 ? channels.split(",") : channels,
        file: `/folders/${req.file.filename}`,
        fileType: fileType ? fileType : req.file.mimetype.split("/")[0],
        author: user._id,
    });
    folder.news.push(news._id);
    await folder.save();
    user.news.push(news._id);
    await user.save();
    res.status(201).json(news);
    }catch(err){
        fs.unlinkSync(req.file.path);
        next(err);
    }
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
    const { newsId, title, description, file, fileType,channels } = req.body;
    const news = await News.findOne({ _id: newsId });
    console.log(news);
    
        if (news.file.split("/")[2] !== file) {
            fs.unlink(`./public/folders/${news.file.split("/")[2]}`, (err) => {
                if (err) {
                }
            });
        }
        news.file = `/folders/${req.file.filename}`;

    news.title = title;
    news.description = description;
    news.channels = channels.length > 27 ? channels.split(",") : channels;
    news.fileType= fileType ? fileType : req.file.mimetype.split("/")[0];
    await news.save();
    res.status(200).json({
        success: true,
        message: "News updated successfully",
        news,
    });
});

exports.AllNews = catchAsyncErrors(async (req, res, next) => {
    const news = await News.find().populate("channels");
    res.status(200).json(news);
});

exports.SingleNews = catchAsyncErrors(async (req, res, next) => {
    const news = await News.findById(req.params.id).populate("channels");
    if (!news) return next(new ErrorHandler("News not found", 404));
    res.status(200).json(news);
});
