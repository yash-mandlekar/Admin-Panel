const Add = require("../../models/adminModels/advertisementModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const fs = require("fs");

exports.CreateAdd = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      title,
      description,
      link,
      targetAudience,
      advertisementLocation,
      sortOrder,
    } = req.body;

    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return Buffer.from(bitmap).toString("base64");
    }

    const file = base64_encode(req.file.path);

    const add = await Add.create({
      title,
      description,
      file: file,
      link,
      targetAudience,
      advertisementLocation,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      add,
    });
  } catch (err) {
    next(err);
  }
});

exports.AllAdds = catchAsyncErrors(async (req, res, next) => {
  const adds = await Add.find();
  res.status(200).json(adds);
});

exports.GetAdd = catchAsyncErrors(async (req, res, next) => {
  const add = await Add.findOne({ _id: req.params.id });
  if (!add) {
    return next(new ErrorHandler("Add not found", 404));
  }
  res.status(200).json(add);
});

exports.UpdateAdd = catchAsyncErrors(async (req, res, next) => {
  const add = await Add.findById(req.params.id);
  if (!add) {
    return next(new ErrorHandler("Add not found", 404));
  }
  add.title = req.body.title;
  await add.save();
  res.status(200).json({
    status: "success",
    add,
  });
});

exports.DeleteAdd = catchAsyncErrors(async (req, res, next) => {
  const add = await Add.findById(req.params.id);
  if (!add) {
    return next(new ErrorHandler("Add not found", 404));
  }
  await add.remove();
  res.status(200).json({
    status: "success",
    message: "Add deleted successfully",
  });
});
