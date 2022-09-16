const AppUser = require("../../models/userModels/appUserModel");
const Post = require("../../models/userModels/postModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const { post } = require("../../routes/userRoutes");
const fs = require("fs");

exports.CreatePost = catchAsyncErrors(async (req, res, next) => {
    const user = await AppUser.findById(req.user.id);
    const { location, title, description, file, fileType } = req.body;
    const post = await Post.create({
        location,
        title,
        description,
        file: `./uploads/${req.file.filename}`,
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


exports.DeletePost = catchAsyncErrors(async (req, res, next) => {
    const user = await AppUser.findById(req.user.id);
    const { postId } = req.body;
    const post = await Post.findOne({ _id: postId });
    // console.log(postId);
    // console.log(post.file.split("/")[2]);
    fs.unlink(`./public/uploads/${post.file.split("/")[2]}`, (err) => {
        if (err) {
        }
    });
    console.log(user.posts.indexOf(postId));
    const index = user.posts.indexOf(postId);
    user.posts.splice(index, 1);
    await user.save();
    await post.remove();
    res.status(201).json({
        success: true,
        message: "post deleted successfully",
    });
});

exports.UpdatePost = catchAsyncErrors(async (req, res, next) => {
    const { postId, location, title, description } = req.body;
    const post = await Post.findOne({ _id: postId });
    post.location = location;
    post.title = title;
    post.description = description;
    await post.save();
    res.status(201).json({
        success: true,
        message: "post updated successfully",
    });
});

exports.GetPost = catchAsyncErrors(async (req, res, next) => {
    const post = await Post.find();
    res.status(200).json({
        status: "success",
        post,
    });
});

exports.GetPostById = catchAsyncErrors(async (req, res, next) => {
    const post = await Post.findById(req.body.id);
    res.status(200).json({
        status: "success",
        post,
    });
});





