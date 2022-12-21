const eNewspaper = require("../../models/adminModels/eNewspaperModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const fs = require("fs");

exports.CreateENewspaper = catchAsyncErrors(async (req, res, next) => {
  const { city, pageNo, date } = req.body;

  function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString("base64");
  }
  const image = base64_encode(req.file.path);
  const ewspaper = await eNewspaper.create({
    city,
    pageNo,
    image: image,
    date,
  });
  res.status(201).json({
    status: "success",
    ewspaper,
  });
});

exports.AllENewspapers = catchAsyncErrors(async (req, res, next) => {
  const ewspaper = await eNewspaper.find();
  res.status(200).json(ewspaper);
});

exports.GetENewspaper = catchAsyncErrors(async (req, res, next) => {
  const ewspaper = await eNewspaper.findOne({ _id: req.params.id });
  if (!ewspaper) {
    return next(new ErrorHandler("ENewspaper not found", 404));
  }
  res.status(200).json(ewspaper);
});

exports.UpdateENewspaper = catchAsyncErrors(async (req, res, next) => {
  // find ewspaper by id and update it
  const ewspaper = await eNewspaper.findOneAndUpdate(
    { _id: req.params.id },
    req.body
  );
  function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
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
});

exports.DeleteENewspaper = catchAsyncErrors(async (req, res, next) => {
  const ewspaper = await eNewspaper.findOneAndDelete({ _id: req.params.id });
  if (!ewspaper) {
    return next(new ErrorHandler("ENewspaper not found", 404));
  }
  res.status(200).json({
    status: "success",
    ewspaper,
  });
});
exports.CityNewsPaper = catchAsyncErrors(async (req, res, next) => {
  const ewspaper = await eNewspaper.find({ city: req.params.city });
  res.status(200).json(ewspaper);
});
