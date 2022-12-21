const BreakingNews = require("../../models/adminModels/breakingNewsModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.CreateBreakingNews = catchAsyncErrors(async (req, res, next) => {
    const breakingNews = await BreakingNews.create(req.body);
    res.status(200).json({
        status: "success",
        breakingNews,
    });
});

exports.AllBreakingNews = catchAsyncErrors(async (req, res, next) => {
    const breakingNews = await BreakingNews.find();
    res.status(200).json(breakingNews);
});

exports.GetBreakingNews = catchAsyncErrors(async (req, res, next) => {
    const breakingNews = await BreakingNews.findOne({_id:req.params.id});
    if (!breakingNews) {
        return next(new ErrorHandler("Breaking News not found", 404));
    }   
    res.status(200).json(breakingNews);
});

exports.UpdateBreakingNews = catchAsyncErrors(async (req, res, next) => {
    const breakingNews = await BreakingNews.findById(req.params.id);
    if (!breakingNews) {
        return next(new ErrorHandler("Breaking News not found", 404));
    }
    breakingNews.title = req.body.title;
    await breakingNews.save();
    res.status(200).json({
        status: "success",
        breakingNews,
    });
});

exports.DeleteBreakingNews = catchAsyncErrors(async (req, res, next) => {
    const breakingNews = await BreakingNews.findById(req.params.id);
    if (!breakingNews) {
        return next(new ErrorHandler("Breaking News not found", 404));
    }
    await breakingNews.remove();
    res.status(200).json({
        status: "success", 
        message: "Breaking News deleted successfully",
    });
}); 

