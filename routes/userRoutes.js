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
  GetUserByUserName,
  AddInterest,
  UpdateAppUser,
  UpdateProfilePic,
  DeleteAppUser,
  FollowRequestAccept,
  FollowRequest,
  FollowUnfollow,
  DeleteProfilePic,
  UpdateCoverPic,
  DeleteCoverPic,
  GetSingleUserByUserName,
  PostGoLive,
  GetRemoveLive,
  GetIsLive,
  GetZegoToken,
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
  PostCommentDelete,
  SavePost,
  UserFeeds,
} = require("../controllers/userController/postController");

const {
  SaveNews,
  GetSavedNews,
} = require("../controllers/adminController/newsController");

const {
  CreateUserNews,
} = require("../controllers/userController/userNewsController");

const { isLoggedin } = require("../middleware/login");
const {
  ShortsLike,
  ShortsComment,
  ShortsCommentDelete,
} = require("../controllers/adminController/shortsController");
const { translate } = require("../controllers/userController/langTranslator");

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
  .get("/profile/:id", GetAppUser);

// @api /user/profile GET user profile
router.get("/profile/user/:username", GetUserByUserName);

// @api /user/profile GET user profile
router.get("/profile/singleUser/:username", GetSingleUserByUserName);

// @api /user/profile/pic POST user profile pic
router
  .post(
    "/profile/pic",
    isLoggedin,
    uploadDp.single("profileImage"),
    UpdateProfilePic
  )
  .delete("/profile/pic", isLoggedin, DeleteProfilePic);

// @api /user/post POST UpdateCoverPic user
router
  .post("/cover/pic", isLoggedin, upload.single("coverImage"), UpdateCoverPic)
  .delete("/cover/pic", isLoggedin, DeleteCoverPic);

// @api/POST ShortsLike
router.get("/shorts/like/:id", isLoggedin, ShortsLike);

// @api/POST ShortsComment
router.post("/shorts/comment/:id", isLoggedin, ShortsComment);

// @api/POST ShortsCommentDelete
router.delete(
  "/shorts/comment/delete/:id/:commentId",
  isLoggedin,
  ShortsCommentDelete
);

// @api /user/followUnfollow POST follow user
router.post("/followUnfollow/:id", isLoggedin, FollowUnfollow);

// @api /user/followRequest POST follow user
router.post("/followRequest/:id", isLoggedin, FollowRequest);

// @api /user/followRequestAccept POST follow user
router.post("/followRequestAccept/:id", isLoggedin, FollowRequestAccept);

// @api /user/post POST create post
router
  .post("/post", isLoggedin, upload.single("file"), CreatePost)
  .get("/post", isLoggedin, GetPost)
  .put("/post/:id", isLoggedin, upload.single("file"), UpdatePost)
  .delete("/post/:id", isLoggedin, DeletePost);

// @api /user/post/following GET post
router.get("/post/following", isLoggedin, GetPostFollowing);

// @api /user/post/interest GET post
router.get("/post/interest", isLoggedin, GetPostByUserIntrest);

// @api /user/post/likes
router.get("/post/likes/:id", isLoggedin, PostLikes);

// @api /user/post/comment
router.post("/post/comment", isLoggedin, PostComments);

// @api /user/post/comment/delete
router.delete(
  "/post/comment/delete/:id/:commentId",
  isLoggedin,
  PostCommentDelete
);

// @api /user/post/GetPostRandom
router.get("/feed", isLoggedin, UserFeeds);

// @api /user/post/:id GET post by id
router.get("/post/:id", GetPostById);

// @api /user/post translate POST translate post
router.post("/translate", translate);

// @api /user/savednews GET save news
router.post("/savednews/:id", isLoggedin, SaveNews);

// @api /user/savepost POST save news
router.post("/savepost/:id", isLoggedin, SavePost);

// @api /user/savednews GET save news
router.get("/savednews", isLoggedin, GetSavedNews);

// @api /user/zego/token/:roomId GET save news
router.get("/zego/token/:roomId", GetZegoToken);

// @api /user/golive GET save news
router.post("/golive", isLoggedin, PostGoLive);

// @api /user/islive/:username GET save news
router.get("/islive/:username", GetIsLive);

// @api /user/removeLive GET save news
router.get("/removeLive", isLoggedin, GetRemoveLive);

// @api /user/usernews POST save news
router.post("/usernews", upload.single("file"), isLoggedin, CreateUserNews);

module.exports = router;
