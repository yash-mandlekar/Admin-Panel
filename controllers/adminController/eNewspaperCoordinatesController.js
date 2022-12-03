// const eNewspaperCordinates = require("../../models/adminModels/eNewspaperCordinatesModel");
// const ErrorHandler = require("../../utils/ErrorHandler");
// const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
// const fs = require("fs");

// exports.CreateENewspaperCoordinates = catchAsyncErrors(async (req, res, next) => {
//     const { city, pageNo, date, leftCoordinate, topCoordinate, sectionWidth, sectionHeight, newsUrl } = req.body;
//     const ewspaper = await eNewspaperCordinates.create({
//         city,
//         pageNo,
//         date,
//         leftCoordinate,
//         topCoordinate,
//         sectionWidth,
//         sectionHeight,
//         newsUrl,
//     });
//     res.status(201).json({
//         status: "success",
//         ewspaper,
//     });
//     });