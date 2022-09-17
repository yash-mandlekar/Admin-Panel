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
const { isAuthUser } = require("../middleware/auth");




// @api/ GET Hompage
router.get("/", GetHomepage);

// @api/register POST register admin and adminpanel users
router.post("/register", PostRegisterUser);

// @api/login POST login user
router.post("/login", PostLoginUser);

// @api/logout POST logout user
router.post("/logout", LogoutUser);

// @api/refreshtoken POST re-login user
router.post("/refreshtoken", PostRefreshToken);

// @api/forgot POST login user
router.post("/forgot", isAuthUser, ForgotPassword)

// @api/reset/:resetToken POST login user
router.post("/reset/:resetToken", isAuthUser, ResetPassword)

// @api/change password POST login user
router.post("/change", isAuthUser, ChangePassword)

// @api/users GET all users
router.get("/users", isAuthUser, GetUsers);

// @api/admin Delete user
router.delete("/users/delete", isAuthUser, RemoveUser);

// @api/editor GET user profile
router.get("/editor", isAuthUser, GetEditor);

//@api/admin GET user profile
router.get("/admin", isAuthUser, GetAdmin);

//@api/senior-editor GET user profile
router.get("/senior-editor", isAuthUser, GetSeniorEditor);

//@api/reporter GET user profile
router.get("/reporter", isAuthUser, GetReporter);


// @api /admin/profile/pic POST user profile pic
router.post("/profile/pic", isAuthUser, uploadDp.single("profilePic"), UpdateProfilePic);



// @api/upload POST upload news
router
    .post("/news", upload.single("file"), isAuthUser, UploadNews)
    .delete("/news", isAuthUser, DeleteNews)
    .put("/news", upload.single("file"), isAuthUser, UpdateNews)
    .get("/news/:id", isAuthUser, SingleNews)

// @api/GET all news
router.get("/all/news", isAuthUser, AllNews)


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
router.get("/open/channel/:id", isAuthUser, GetChannel)


module.exports = router;