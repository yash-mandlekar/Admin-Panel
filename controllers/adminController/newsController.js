const User = require("../models/userModel");
const News = require("../models/newsModel");
const Folders = require("../models/folderModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");


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
    // console.log(req.body);
    const folder = await Folders.findOne({ _id:folderId });
    // console.log(folder);
    const news = await News.findOne({ _id:newsId });
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
      console.log("lol : ",req.body);
      const { newsId, folderId } = req.body;
    const user = await User.findById(req.user.id);

    const folder = await Folders.findOne({ _id:folderId });
    const news = await News.findOneAndUpdate({ _id:newsId }, req.body);
    // console.log(news);
    if (!news) return next(new ErrorHandler("News not found", 404));
    user.news.push(news._id);
    folder.news.push(news._id);
    await user.save();
    await folder.save();
    res.status(200).json({
        success: true,
        message: "News updated successfully",
        });
    }
    );
