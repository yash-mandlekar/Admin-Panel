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
} = require("../controllers/userControllers");
const { isAuthUser } = require("../middleware/auth");
const upload = require("../middleware/multer");

// @api /user/ GET Hompage
router.get("/", GetHomepage);

// @api /user/register POST register user
router.post("/register", PostRegisterUser);

// @api /user/login POST login user
router.post("/login", PostLoginUser);

// @api /user/logout POST logout user
router.post("/logout", LogoutUser);

// @api /user/refreshtoken POST re-login user
router.post("/refreshtoken", PostRefreshToken);

// @api /user/forgot POST login user
router.post("/forgot", ForgotPassword);

// @api /user/reset/:resetToken POST login user
router.post("/reset/:resetToken", ResetPassword);

// @api /user/news POST create news
router.post("/news/:folderId", UploadNews);

// @api /user/folder POST create folder
router.post("/create/folder",isAuthUser, CreateFolder);

// @api /user/folder GET get all folder
router.get("/showall/folder", AllFolders);

// @api /user/folder/:id DELETE delete folder
router.delete("/delete/folder/:id", DeleteFolder);

// @api /user/folder/:id PUT update folder
router.put("/update/folder/:folderName", UpdateFolder);

// @api /user/folder/:id GET open folder
router.get("/open/folder/:id", OpenFolder);

module.exports = router;
