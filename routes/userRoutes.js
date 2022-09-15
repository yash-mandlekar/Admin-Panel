const express = require("express")
const router = express.Router();
const multer = require("multer");

const {
  GetHomepage,
  PostRegisterUser,
  PostLoginUser,
  LogoutUser,
  PostRefreshToken,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
} = require("../controllers/adminController/userController");

const {
  CreateFolder,
  AllFolders,
  UpdateFolder,
  DeleteFolder,
  OpenFolder,
} = require("../controllers/adminController/folderController");

const {
  UploadNews,
  DeleteNews,
  UpdateNews,
  AllNews,
  SingleNews,
} = require("../controllers/adminController/newsController");

const {
  CreateChannel,
  AllChannels,
  GetChannel,
  UpdateChannel,
  DeleteChannel,
} = require("../controllers/adminController/channelController");


const {
  PostRegisterAppUser,
  PostLoginAppUser,
  LogoutAppUser,
  PostRefreshAppToken,
  ForgotPasswordApp,
  ResetPasswordApp,
  ChangePasswordApp,
} = require("../controllers/userController/appUserController");


const { isAuthUser } = require("../middleware/auth");
const upload = require("../middleware/multer");


/////////////////////////////////////////////////////////Admin Panel Routes////////////////////////////////////////////////////////////

// @api/ GET Hompage
router.get("/", GetHomepage);

// @api/register POST register admin and adminpanel users
router.post("/register", PostRegisterUser);

// @api/login POST login user
router.post("/login", PostLoginUser);

// @api/logout POST logout user
router.post("/logout",LogoutUser);

// @api/refreshtoken POST re-login user
router.post("/refreshtoken", PostRefreshToken);

// @api/forgot POST login user
router.post("/forgot", isAuthUser, ForgotPassword)

// @api/reset/:resetToken POST login user
router.post("/reset/:resetToken", isAuthUser, ResetPassword)

// @api/change password POST login user
router.post("/change", isAuthUser, ChangePassword)

// @api/upload POST upload news
router
  .post("/news", upload.single("file"), isAuthUser, UploadNews)
  .delete("/news", isAuthUser, DeleteNews)
  .put("/news", upload.single("file"), isAuthUser, UpdateNews)
  .get("/news", isAuthUser, SingleNews)
 
  // @api/GET all news
router.get("/all/news", isAuthUser, AllNews);


// @api/folder POST create folder
router
  .post("/folder", isAuthUser, CreateFolder)
  .get("/folder", isAuthUser, AllFolders)
  .delete("/folder", isAuthUser, DeleteFolder)
  .put("/folder", isAuthUser, UpdateFolder)

// @api/folder/:id GET open folder
router.get("/open/folder/:id", isAuthUser, OpenFolder)

// @api/channel POST create channel
router
.post("/channel", isAuthUser, CreateChannel)
.get("/channel", isAuthUser, AllChannels)
.put("/channel", isAuthUser, UpdateChannel)
.delete("/channel", isAuthUser, DeleteChannel)

// @api/channel/:id GET open channel
router.get("/open/channel", isAuthUser, GetChannel)



///////////////////////////////////////////////////////App Routes////////////////////////////////////////////////////////////

// @api/ GET Hompage
router.get("/", GetHomepage);

// @api/register POST register admin and adminpanel users
router.post("/user/register", PostRegisterAppUser);

// @api/login POST login user
router.post("/user/login", PostLoginAppUser);

// @api/logout POST logout user
router.post("/user/logout",LogoutAppUser);

// @api/refreshtoken POST re-login user
router.post("/user/refreshtoken", PostRefreshAppToken);

// @api/forgot POST login user
router.post("/user/forgot", isAuthUser, ForgotPasswordApp)

// @api/reset/:resetToken POST login user
router.post("/user/reset/:resetToken", isAuthUser, ResetPasswordApp)

// @api/change password POST login user
router.post("/user/change", isAuthUser, ChangePasswordApp)


module.exports = router;