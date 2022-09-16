const AppUser = require("../../models/userModels/appUserModel");
const Post = require("../../models/userModels/postModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.CreatePost = catchAsyncErrors(async (req, res, next) => {
    const user = await AppUser.findById(req.user.id);
    const { location, title, description, file, fileType } = req.body;
    const post = await Post.create({
        location,
        title,
        description,
        file: `./posts/${req.file.filename}`,
        fileType: fileType ? fileType : req.file.mimetype.split("/")[0],
        name: user._id,
    });
    user.posts.push(post._id);
    await user.save();
    res.status(200).json({
        status: "success",
        post,
    });
});

exports.GetPost = catchAsyncErrors(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    res.status(200).json({
        status: "success",
        post,
    });
});