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
router.post("/forgot", ForgotPassword)

// @api/reset/:resetToken POST login user
router.post("/reset/:resetToken", ResetPassword)

// @api/upload POST upload news
router
  .post("/news", upload.single("file"), UploadNews)
  .delete("/news", DeleteNews)

// @api/folder POST create folder
router
  .post("/folder", CreateFolder)
  .get("/folder", AllFolders)
  .delete("/folder/:id", DeleteFolder)
  .put("/folder/:id", UpdateFolder)

// @api/folder/:id GET open folder
router.get("/open/folder/:id", OpenFolder)

module.exports = router;