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

// @api/register POST register user
router.post("/register", PostRegisterUser);

// @api/login POST login user
router.post("/login", PostLoginUser);

// @api/logout POST logout user
router.post("/logout", LogoutUser);

// @api/refreshtoken POST re-login user
router.post("/refreshtoken", PostRefreshToken);

// @api/forgot POST login user
router.post("/forgot", ForgotPassword);

// @api/reset/:resetToken POST login user
router.post("/reset/:resetToken", ResetPassword);

// @api/news POST create news
router.post("create/news", UploadNews);

// @api/news/:id DELETE delete news
router.delete("/delete/news/:id", DeleteNews);

// @api/folder POST create folder
router.post("/create/folder", CreateFolder);

// @api/folder GET get all folder
router.get("/showall/folder", AllFolders);

// @api/folder/:id DELETE delete folder
router.delete("/delete/folder/:id", DeleteFolder);

// @api/folder/:id PUT update folder
router.put("/update/folder/:id", UpdateFolder);

// @api/folder/:id GET open folder
router.get("/open/folder/:id", OpenFolder);

module.exports = router;
