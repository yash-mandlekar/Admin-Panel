const express = require("express")
const router = express.Router();
const upload = require("../middleware/userMulter");

const {
  GetHomepage,
  PostRegisterAppUser,
  PostLoginAppUser,
  LogoutAppUser,
  PostRefreshAppToken,
  ForgotPasswordApp,
  ResetPasswordApp,
  ChangePasswordApp,
  GetAppUser,
  UpdateAppUser,
  UpdateProfilePic,
  DeleteAppUser,
} = require("../controllers/userController/appUserController");

const {
  CreatePost,
  GetPost,
  GetPostById,
  DeletePost,
  UpdatePost,
} = require("../controllers/userController/postController");

const { isLoggedin } = require("../middleware/login");



// @api /user/ GET Hompage
router.get("/", GetHomepage);

// @api /user/register POST register admin and adminpanel users
router.post("/register", PostRegisterAppUser);

// @api /user/login POST login user
router.post("/login", PostLoginAppUser);

// @api /user/logout POST logout user
router.post("/logout", LogoutAppUser);

// @api /user/refreshtoken POST re-login user
router.post("/refreshtoken", PostRefreshAppToken);

// @api /user/forgot POST login user
router.post("/forgot", isLoggedin, ForgotPasswordApp)

// @api /user/reset/:resetToken POST login user
router.post("/reset/:resetToken", isLoggedin, ResetPasswordApp)

// @api /user/change password POST login user
router.post("/change", isLoggedin, ChangePasswordApp)

// @api /user/profile GET user profile
router
  .get("/profile", isLoggedin, GetAppUser)
  .put("/profile", isLoggedin, UpdateAppUser)
  .delete("/profile", isLoggedin, DeleteAppUser);


// @api /user/profile/pic POST user profile pic
router.post("/profile/pic", isLoggedin, upload.single("profilePic"), UpdateProfilePic);


// @api /user/post POST create post
router
  .post("/post", isLoggedin, upload.single("file"), CreatePost)
  .get("/post", isLoggedin, GetPost)
  .delete("/post", isLoggedin, DeletePost)
  .put("/post", isLoggedin,upload.single("file"), UpdatePost);


// @api /user/post/:id GET post by id
router.get("/all/post", isLoggedin, GetPostById)
  
module.exports = router;