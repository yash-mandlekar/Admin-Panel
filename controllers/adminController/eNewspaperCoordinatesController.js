const eNewspaperCordinates = require("../../models/adminModels/eNewspaperCordinatesModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const fs = require("fs");

exports.CreateENewspaperCoordinates = catchAsyncErrors(async (req, res, next) => {
    const { city, pageNo, date, leftCoordinate, topCoordinate, sectionWidth, sectionHeight, newsUrl } = req.body;
    function base64_encode(file) {
        var bitmap = fs.readFileSync
        (file);
        return Buffer.from(bitmap).toString("base64");
    }
    const image = base64_encode(req.file.path);

    const ewspaper = await eNewspaperCordinates.create({
        city,
        pageNo,
        date,
        image: image,
        leftCoordinate,
        topCoordinate,
        sectionWidth,
        sectionHeight,
        newsUrl,
    });
    res.status(201).json({
        status: "success",
        ewspaper,
    });
    });

exports.GetENewspaperCoordinates = catchAsyncErrors(async (req, res, next) => {
    const ewspaper = await eNewspaperCordinates.find();
    res.status(200).json({
        status: "success",
        ewspaper,
    });
    });

exports.UpdateENewspaperCoordinates = catchAsyncErrors(async (req, res, next) => {
    // find ewspaper by id and update it 
    const ewspaper = await eNewspaperCordinates.findOneAndUpdate({ _id: req.params.id }, req.body);                 
    function base64_encode(file) {
        var bitmap = fs.readFileSync
        (file);
        return Buffer.from(bitmap).toString("base64");
    }
    const image = base64_encode(req.file.path);
    ewspaper.image = image;
    await ewspaper.save();
    if (!ewspaper) {
        return next(new ErrorHandler("ENewspaper not found", 404));
    }
    res.status(200).json({
        status: "success",
        ewspaper,
    });
    }
    );

exports.DeleteENewspaperCoordinates = catchAsyncErrors(async (req, res, next) => {
    const ewspaper = await eNewspaperCordinates.findOneAndDelete({ _id: req.params.id });
    if (!ewspaper) {
        return next(new ErrorHandler("ENewspaper not found", 404));
    }
    res.status(200).json({
        status: "success",
        ewspaper,
    });
    }
    );

exports.GetENewspaperCoordinatesById = catchAsyncErrors(async (req, res, next) => {
    const ewspaper = await eNewspaperCordinates.findOne({ _id: req.params.id });
    if (!ewspaper) {
        return next(new ErrorHandler("ENewspaper not found", 404));
    }
    res.status(200).json({
        status: "success",
        ewspaper,
    });
    }
    );
    