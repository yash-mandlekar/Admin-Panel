const AppUser = require("../../models/userModels/appUserModel");
const Post = require("../../models/userModels/postModel");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ErrorHandler = require("../../utils/ErrorHandler");
const fs = require("fs");

exports.CreatePost = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await AppUser.findById(req.user.id);
    const { location, caption, fileType } = req.body;
    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return Buffer.from(bitmap).toString("base64");
    }

    const file = base64_encode(req.file.path);

    const post = await Post.create({
      location,
      caption,
      file: file,
      fileType: fileType ? fileType : req.file.mimetype.split("/")[0],
      author: user._id,
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
  if (post.author.toString() == user._id.toString()) {
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
  x;
  const { location, caption, fileType } = req.body;
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
  post.caption = caption;
  await post.save();
  res.status(200).json({
    status: "success",
    post,
  });
});

exports.GetPost = catchAsyncErrors(async (req, res, next) => {
  //get post of logged in user
  const user = await AppUser.findById(req.user.id).populate("posts");
  res.status(200).json({
    status: "success",
    user,
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
  const post = await Post.findOne({ _id: req.params.id }).populate([
    {
      path: "comments",
      populate: {
        path: "author",
      },
    },
    {
      path: "author",
    },
  ]);

  res.status(200).json({
    status: "success",
    post,
  });
});

exports.GetPostByUserIntrest = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const post = await Post.find({ intrest: { $in: user.intrest } });
  res.status(200).json({
    status: "success",
    post,
  });
});

//GET post user feeds for home page of user and following user
exports.UserFeeds = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id).populate(
    "following",
    "posts"
  );
  const following = user.following.map((user) => user._id);
  if (following.length === 0) {
    // get post of logged in user
    const post = await Post.find({ author: req.user.id }).populate("author");
    res.status(200).json({
      status: "success",
      post,
    });
  } else {
    //get post of logged in user and following user
    const post = await Post.find({ author: { $in: following } }).populate(
      // "author",
      // "likes",
      [
        {
          path: "comments",
          populate: {
            path: "user",
          },
        },
        {
          path: "author",
        },
        {
          path: "likes",
        },
      ]
    );
    res.status(200).json({
      status: "success",
      post,
    });
  }
});

exports.PostLikes = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  var post = await Post.findById(req.params.id);
  if (post.likes.includes(user._id)) {
    const index = post.likes.indexOf(user._id);
    post.likes.splice(index, 1);
  } else {
    post.likes.push(user._id);
  }
  await post.save();
  post = await Post.findById(req.params.id).populate([
    {
      path: "comments",
      populate: {
        path: "user",
      },
    },
    {
      path: "author",
    },
    {
      path: "likes",
    },
  ]);
  res.status(200).json({
    status: "success",
    post,
  });
});

exports.PostComments = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const { postId, comment } = req.body;
  const post = await Post.findById(postId);
  post.comments.push({ comment, user: user._id });
  await post.save();
  const newComment = await Post.findById(postId).populate({
    path: "comments",
    populate: {
      path: "user",
    },
  });

  res.status(200).json({
    status: "success",
    message: "Comment added successfully",
    comments: newComment,
  });
});

exports.PostCommentDelete = catchAsyncErrors(async (req, res, next) => {
  const user = await AppUser.findById(req.user.id);
  const post = await Post.findById(req.params.id);
  const comment = post.comments.find(
    (comment) => comment._id.toString() === req.params.commentId
  );
  if (!comment) {
    return next(new ErrorHandler("Comment not found", 404));
  }
  if (comment.name.toString() !== user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to delete this comment", 401)
    );
  }
  const index = post.comments.indexOf(comment);
  post.comments.splice(index, 1);
  await post.save();
  res.status(200).json({
    status: "success",
    message: "Comment deleted successfully",
    comments: post.comments,
  });
});

exports.SavePost = catchAsyncErrors(async (req, res, next) => {
  const PostId = await Post.findById(req.params.id);
  const user = await AppUser.findById(req.user.id);
  if (user.savedNews.includes(PostId._id)) {
    const index = user.savedNews.indexOf(PostId._id);
    user.savedNews.splice(index, 1);
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Post removed from saved",
    });
  } else {
    user.savedNews.push(PostId._id);
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Post saved successfully",
    });
  }
});
