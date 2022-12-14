const express = require("express");
const router = express.Router();
const upload = require("../middleware/userMulter");
const uploadDp = require("../middleware/dpMulter");

const {
  GetHomepage,
  PostRegisterAppUser,
  PostLoginAppUser,
  postVerifyOtp,
  LogoutAppUser,
  PostRefreshAppToken,
  ForgotPasswordApp,
  ResetPasswordApp,
  ChangePasswordApp,
  GetAppUser,
  AddInterest,
  UpdateAppUser,
  UpdateProfilePic,
  DeleteAppUser,
  FollowRequestAccept,
  FollowRequest,
  FollowUnfollow,
} = require("../controllers/userController/appUserController");

const {
  CreatePost,
  GetPost,
  GetPostByUserIntrest,
  GetPostFollowing,
  GetPostById,
  DeletePost,
  UpdatePost,
  PostLikes,
  PostComments,
} = require("../controllers/userController/postController");

const { isLoggedin } = require("../middleware/login");
const { ShortsLike, ShortsComment, ShortsCommentDelete } = require("../controllers/adminController/shortsController");

// @api /user/ GET Hompage
router.get("/", GetHomepage);

// @api /user/register POST register admin and adminpanel users
router.post("/register", isLoggedin, PostRegisterAppUser);

// @api /user/login POST login user
router.post("/login", PostLoginAppUser);

// @api /user/verify POST verify otp
router.post("/signup", postVerifyOtp);

// @api /user/logout POST logout user
router.post("/logout", LogoutAppUser);

// @api /user/refreshtoken POST re-login user
router.post("/refreshtoken", PostRefreshAppToken);

// @api /user/forgot POST login user
router.post("/forgot", isLoggedin, ForgotPasswordApp);

// @api /user/reset/:resetToken POST login user
router.post("/reset/:resetToken", isLoggedin, ResetPasswordApp);

// @api /user/change password POST login user
router.post("/change", isLoggedin, ChangePasswordApp);

// @api /user/post POST AddIntrests user 
router.post("/interest", isLoggedin, AddInterest);

// @api /user/profile GET user profile
router
.put("/profile", isLoggedin, UpdateAppUser)
.delete("/profile", isLoggedin, DeleteAppUser)
.get("/profile/:id", GetAppUser)

// @api /user/profile/pic POST user profile pic
router.post(
  "/profile/pic",
  isLoggedin,
  uploadDp.single("profilePic"),
  UpdateProfilePic
);


// @api/POST ShortsLike
router.post("/shorts/like/:id", isLoggedin, ShortsLike);

// @api/POST ShortsComment
router.post("/shorts/comment/:id", isLoggedin, ShortsComment);

// @api/POST ShortsCommentDelete
router.delete("/shorts/comment/delete/:id/:commentId", isLoggedin, ShortsCommentDelete);


// @api /user/followUnfollow POST follow user
router.post("/followUnfollow/:id", isLoggedin, FollowUnfollow);

// @api /user/followRequest POST follow user
router.post("/followRequest/:id", isLoggedin, FollowRequest);

// @api /user/followRequestAccept POST follow user
router.post("/followRequestAccept/:id", isLoggedin, FollowRequestAccept);

// @api /user/post POST create post
router
  .post("/post", isLoggedin, upload.single("file"), CreatePost)
  .get("/post",isLoggedin, GetPost)
  .put("/post/:id", isLoggedin, upload.single("file"), UpdatePost)
  .delete("/post/:id", isLoggedin, DeletePost)

// @api /user/post/following GET post
router.get("/post/following",isLoggedin, GetPostFollowing);

// @api /user/post/interest GET post
router.get("/post/interest",isLoggedin, GetPostByUserIntrest);

// @api /user/post/likes
router.post("/post/likes", isLoggedin, PostLikes);

// @api /user/post/comment
router.post("/post/comment", isLoggedin, PostComments);

// @api /user/post/:id GET post by id
router.get("/post/:id", GetPostById);

module.exports = router;
