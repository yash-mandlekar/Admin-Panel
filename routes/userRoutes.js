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
  UploadNews,
  CreateFolder,
  AllFolders,
  DeleteFolder,
  UpdateFolder,
  OpenFolder,
  DeleteNews,
} = require("../controllers/userControllers");
const { isAuthUser } = require("../middleware/auth");
const upload = require("../middleware/multer");

// @api/ GET Hompage
router.get("/", GetHomepage);

// @api/register POST register admin and adminpanel users
router.post("/register", PostRegisterUser);

// @api/login POST login user
router.post("/login", PostLoginUser);

// @api/logout POST logout user
router.post("/logout",isAuthUser,LogoutUser);

// @api/refreshtoken POST re-login user
router.post("/refreshtoken",isAuthUser, PostRefreshToken);

// @api/forgot POST login user
router.post("/forgot",isAuthUser, ForgotPassword)

// @api/reset/:resetToken POST login user
router.post("/reset/:resetToken",isAuthUser, ResetPassword)

// @api/upload POST upload news
router
  .post("/news", upload.single("file"), isAuthUser,UploadNews)
  .delete("/news",isAuthUser, DeleteNews)

// @api/folder POST create folder
router
  .post("/folder",isAuthUser, CreateFolder)
  .get("/folder",isAuthUser, AllFolders)
  .delete("/folder",isAuthUser, DeleteFolder)
  .put("/folder", isAuthUser,UpdateFolder)

// @api/folder/:id GET open folder
router.get("/open/folder/:id",isAuthUser, OpenFolder)

module.exports = router;