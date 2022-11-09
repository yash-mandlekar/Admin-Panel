const express = require("express")
const router = express.Router();
const upload = require("../middleware/adminMulter");
const uploadDp = require("../middleware/dpMulter");


const {
    GetHomepage,
    PostRegisterUser,
    PostLoginUser,
    LogoutUser,
    PostRefreshToken,
    ForgotPassword,
    ResetPassword,
    ChangePassword,
    GetUsers,
    GetAdmin,
    GetEditor,
    GetSeniorEditor,
    GetReporter,
    UpdateProfilePic,
    RemoveUser,
    PostRegisterAdmin,
    BlockUser,
    UpdateUser,
    SingleUser,
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
    NewsByCategory,
    ApproveNews
   
} = require("../controllers/adminController/newsController");

const {
    CreateChannel,
    AllChannels,
    GetChannel,
    UpdateChannel,
    DeleteChannel,
} = require("../controllers/adminController/channelController");
const { isAuthUser } = require("../middleware/auth");

const {
    CreateCategory,
    AllCategories,
    GetCategory,
    UpdateCategory,
    DeleteCategory,
    GetCategoryByName,
}= require("../controllers/adminController/categoryController");


const {
    CreateBreakingNews,
    AllBreakingNews,
    GetBreakingNews,
    UpdateBreakingNews,
    DeleteBreakingNews,
} = require("../controllers/adminController/breakingNewsController");


// @api/ GET Hompage
router.get("/", GetHomepage);

// @api/register POST register admin and adminpanel users
router.post("/register", isAuthUser, PostRegisterUser);

// @api/login POST login admin and adminpanel users
// router.post("/register/admin", PostRegisterAdmin);

// @api/login POST login user
router.post("/login", PostLoginUser);

// @api/logout POST logout user
router.post("/logout", LogoutUser);

// @api/refreshtoken POST re-login user
router.post("/refreshtoken", PostRefreshToken);

// @api/forgot POST login user
router.post("/forgot", isAuthUser, ForgotPassword)

// @api/reset/:resetToken POST login user
router.post("/reset/:resetToken", ResetPassword)

// @api/change password POST login user
router.post("/change", isAuthUser, ChangePassword)

// @api/users GET all users
router.get("/users", GetUsers);

// @api/users GET SingleUser
router.get("/users/:id", SingleUser);

// @api/admin Delete user
router.delete("/users/delete", isAuthUser, RemoveUser);

// @api/editor GET user profile
router.get("/editor", GetEditor);

//@api/admin GET user profile
router.get("/admin", GetAdmin);

//@api/senior-editor GET user profile
router.get("/senior-editor", GetSeniorEditor);

//@api/reporter GET user profile
router.get("/reporter", GetReporter);

//@api/block-user POST block user
router.post("/block-user", isAuthUser, BlockUser);


// @api /admin/profile/pic POST user profile pic
router.post("/profile/pic", isAuthUser, uploadDp.single("profilePic"), UpdateProfilePic);

// @api/admin post update user profile
router.post("/update/profile", isAuthUser, UpdateUser);


// @api/upload POST upload news
router
    .post("/news", upload.single("file"), isAuthUser, UploadNews)
    .delete("/news", isAuthUser, DeleteNews)
    .put("/news", upload.single("file"), isAuthUser, UpdateNews)
    .get("/news/:id", SingleNews)

// @api/GET all news
router.get("/all/news", AllNews)


// @api/GET news by categoryUrl
router.get("/news/category/:categoryUrl", NewsByCategory)


// @api/approve-news POST approve news
router.post("/approve-news/:id", isAuthUser, ApproveNews)


// @api/folder POST create folder
router
    .post("/folder", isAuthUser, CreateFolder)
    .get("/folder", AllFolders)
    .delete("/folder", isAuthUser, DeleteFolder)
    .put("/folder", isAuthUser, UpdateFolder)

// @api/folder/:id GET open folder
router.get("/open/folder/:id", OpenFolder)

// @api/channel POST create channel
router
    .post("/channel", isAuthUser, CreateChannel)
    .get("/channel", AllChannels)
    .put("/channel", isAuthUser, UpdateChannel)
    .delete("/channel", isAuthUser, DeleteChannel)

// @api/channel/:id GET open channel
router.get("/open/channel/:id", GetChannel)


// @api/category POST create category
router
.post("/category", isAuthUser, CreateCategory)
.get("/category", AllCategories)
.put("/category/:id", isAuthUser, UpdateCategory)
.delete("/category/:id", isAuthUser, DeleteCategory)

// @api/category/:id GET open category
router.get("/category/:id", GetCategory)


// @api/category/:name GET open category
router.get("/category/name/:name", GetCategoryByName)


// @api/breaking-news POST create breaking news
router
.post("/breaking-news", isAuthUser, CreateBreakingNews)
.get("/breaking-news", AllBreakingNews)
.put("/breaking-news/:id", isAuthUser, UpdateBreakingNews)
.delete("/breaking-news/:id", isAuthUser, DeleteBreakingNews)

// @api/breaking-news/:id GET open breaking news
router.get("/breaking-news/:id", GetBreakingNews)


module.exports = router;