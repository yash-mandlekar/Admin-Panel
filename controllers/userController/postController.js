const AppUser = require("../../models/userModels/appUserModel");
const Post = require("../../models/userModels/postModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const { post } = require("../../routes/userRoutes");
const fs = require("fs");
const { log } = require("console");

exports.CreatePost = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await AppUser.findById(req.user.id);
    const { location, title, description, fileType } = req.body;
    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return Buffer.from(bitmap).toString("base64");
    }

    const file = base64_encode(req.file.path);

    const post = await Post.create({
      location,
      title,
      description,
      file: file,
      fileType: fileType ? fileType : req.file.mimetype.split("/")[0],
      name: user._id,
    });
    user.posts.push(post._id);
    await user.save();
    res.status(200).json({
      status: "success",
      post,
    });
  } catch (err) {
    fs.unlinkSync(req.file.path);
    next(err);
  }
});

exports.DeletePost = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }
  // delete post from user posts if it is the author of the post
  if (post.name.toString() === user._id.toString()) {
    user.posts.pop(post._id);
    await user.save();
  }
  await post.remove();
  res.status(200).json({
    status: "success",
    message: "Post deleted successfully",
  });
});

exports.UpdatePost = catchAsyncErrors(async (req, res, next) => {
  const { location, title, description, fileType } = req.body;
  const post = await Post.findById(req.params.id);
  const user = await AppUser.findById(req.user.id);
  if (!post) {
    return next(new ErrorHandler("Post not found", 404));
  }
  if (post.name.toString() !== user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to update this post", 401)
    );
  }
  if (req.file) {
    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return Buffer.from(bitmap).toString("base64");
    }
    const file = base64_encode(req.file.path);
    post.file = file;
    post.fileType = fileType ? fileType : req.file.mimetype.split("/")[0];
  }
  post.location = location;
  post.title = title;
  post.description = description;
  await post.save();
  res.status(200).json({
    status: "success",
    post,
  });
});

exports.GetPost = catchAsyncErrors(async (req, res, next) => {
  //get post of logged in user
  const user = await AppUser.findById(req.user.id);
  const post = await Post.find({ name: user._id });
  res.status(200).json({
    status: "success",
    post,
  });
});

//GET post if following
exports.GetPostFollowing = catchAsyncErrors(async (req, res, next) => {
  //get post to user and following user
  const user = await AppUser.findById(req.user.id).populate("following");
  const following = user.following.map((user) => user._id);
  const post = await Post.find({ name: { $in: following } });
  res.status(200).json({
    status: "success",
    post,
  });
});

exports.GetPostById = catchAsyncErrors(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  res.status(200).json({
    status: "success",
    post,
  });
});

exports.PostLikes = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const { postId } = req.body;
  const post = await Post.findById(postId);
  if (post.likes.includes(user._id)) {
    const index = post.likes.indexOf(user._id);
    post.likes.splice(index, 1);
    await post.save();
    res.status(200).json({
      status: "success",
      post,
    });
  } else {
    post.likes.push(user._id);
    await post.save();
    res.status(200).json({
      status: "success",
      post,
    });
  }
});

exports.PostComments = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const { postId, comment } = req.body;
  const post = await Post.findById(postId);
  post.comments.push({ comment, name: user._id });
  await post.save();
  res.status(200).json({
    status: "success",
    post,
  });
});
