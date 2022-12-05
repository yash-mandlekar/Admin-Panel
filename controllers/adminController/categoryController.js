const Category = require("../../models/adminModels/categoryModel");
const ErrorHandler = require("../../utils/ErrorHandler");
const Shorts = require("../../models/adminModels/shortsModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const { PostLoginUser } = require("./userController");
const fs = require("fs");


exports.CreateCategory = catchAsyncErrors(async (req, res, next) => {
    const {
        parentCategory,
        sortOrder,
        showInMenu,
        showInChild,
        englishName,
        hindiName,
        startingAlphabet,
        categoryUrl ,
        metaTitle,
        metaDescription,
    } = req.body;
    
    
    const category = await Category.create({
        parentCategory:
        parentCategory && parentCategory.length > 0 ? parentCategory : null,
          sortOrder,
          showInMenu,
          showInChild,
          englishName,
          hindiName,
          startingAlphabet,
          categoryUrl,
          metaTitle,
          metaDescription,
        });
   
        
        if (parentCategory.length > 0) {
          const parent = await Category.findOne({ _id: parentCategory });
          parent.child.push(category._id);
          await parent.save();
        }
      
        res.status(200).json({
          status: "success",
          category,
        });
      });

exports.AllCategories = catchAsyncErrors(async (req, res, next) => {
    const categories = await Category.find().populate("parentCategory");
    res.status(200).json(categories);
});

exports.GetCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findOne({_id:req.params.id});
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }   
    res.status(200).json(category);
});

exports.UpdateCategory = catchAsyncErrors(async (req, res, next) => {
    
    const category = await Category.findOneAndUpdate({_id:req.params.id},req.body);
    function base64_encode(file) {
        var bitmap = fs.readFileSync(file);
        return Buffer.from(bitmap).toString("base64");
      }
    res.status(200).json({
        status: "success",
        category,
    });
});

exports.DeleteCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    await category.remove();
    res.status(200).json({
        status: "success", 
        message: "Category deleted successfully",
    });
});