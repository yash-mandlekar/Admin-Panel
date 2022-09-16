const AppUser = require("../../models/userModels/appUserModel");
const Post = require("../../models/userModels/postModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const { post } = require("../../routes/userRoutes");

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

exports.DeletePost = catchAsyncErrors(async (req, res, next) => {
    const user = await AppUser.findById(req.user.id);
    const { postId } = req.body;
    // console.log(req.body);
    const news = await Post.findOne({ _id: postId });
    const index = folder.news.indexOf(postId);
    folder.news.splice(index, 1);
    user.news.splice(user.post.indexOf(postId), 1);
    await folder.save();
    await user.save();
    await post.remove();
    res.status(201).json({
        success: true,
        message: "Post deleted successfully",
    });
});
