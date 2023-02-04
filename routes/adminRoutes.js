const express = require("express");
const router = express.Router();
const upload = require("../middleware/adminMulter");
const uploadDp = require("../middleware/dpMulter");
const uploadShorts = require("../middleware/shortsMulter");
const uploadNews = require("../middleware/newsMulter");
const { isAuthUser } = require("../middleware/auth");

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
  BlockAppUser,
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
  UploadShorts,
  DeleteShorts,
  UpdateShorts,
  AllShorts,
  SingleShorts,
} = require("../controllers/adminController/shortsController");

const {
  UploadNews,
  DeleteNews,
  UpdateNews,
  AllNews,
  SingleNews,
  ApproveNews,
  GetNewsByCategory,
  GetNewsByAuthor,
  GetNewsByDate,
  GetNewsByLocation,
  GetNewsByHashTag,
  GetNewsByCategoryName,
  RandomNews,
  ApprovedNews,
  PendingNews,
  NewsLikes,
  NewsComments,
  NewsCommentDelete,
} = require("../controllers/adminController/newsController");

const {
  CreateChannel,
  AllChannels,
  GetChannel,
  UpdateChannel,
  DeleteChannel,
} = require("../controllers/adminController/channelController");

const {
  CreateCategory,
  AllCategories,
  GetCategory,
  UpdateCategory,
  DeleteCategory,
} = require("../controllers/adminController/categoryController");

const {
  CreateNewsCategory,
  AllNewsCategories,
  GetNewsCategory,
  UpdateNewsCategory,
  DeleteNewsCategory,
} = require("../controllers/adminController/newsCategoryController");

const {
  CreateBreakingNews,
  AllBreakingNews,
  GetBreakingNews,
  UpdateBreakingNews,
  DeleteBreakingNews,
} = require("../controllers/adminController/breakingNewsController");

const {
  CreateAdd,
  AllAdds,
  GetAdd,
  UpdateAdd,
  DeleteAdd,
} = require("../controllers/adminController/advertisementController");
const { single } = require("../middleware/adminMulter");

const {
  CreateENewspaper,
  AllENewspapers,
  GetENewspaper,
  UpdateENewspaper,
  DeleteENewspaper,
  CityNewsPaper,
} = require("../controllers/adminController/eNewspaperController");

const {
  CreateENewspaperCoordinates,
  GetENewspaperCoordinatesById,
  GetENewspaperCoordinates,
  UpdateENewspaperCoordinates,
  DeleteENewspaperCoordinates,
} = require("../controllers/adminController/eNewspaperCoordinatesController");

const {
  GetUserNews,
  GetUserNewsById,
  UpdateUserNews,
  DeleteUserNews,
} = require("../controllers/userController/userNewsController");

// @api/ GET Hompage
router.get("/", GetHomepage);

// @api/register POST register admin and adminpanel users
router.post("/register", isAuthUser, PostRegisterUser);

// @api/login POST login admin and adminpanel users
router.post("/register/admin", PostRegisterAdmin);

// @api/login POST login user
router.post("/login", PostLoginUser);

// @api/logout POST logout user
router.post("/logout", LogoutUser);

// @api/refreshtoken POST re-login user
router.post("/refreshtoken", PostRefreshToken);

// @api/forgot POST login user
router.post("/forgot", isAuthUser, ForgotPassword);

// @api/reset/:resetToken POST login user
router.post("/reset/:resetToken", ResetPassword);

// @api/change password POST login user
router.post("/change", isAuthUser, ChangePassword);

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

//@api/block-appuser POST block app user
router.post("/block-appuser", isAuthUser, BlockAppUser);

// @api /admin/profile/pic POST user profile pic
router.post(
  "/profile/pic",
  isAuthUser,
  uploadDp.single("profileImage"),
  UpdateProfilePic
);

// @api/admin post update user profile
router.post("/update/profile", isAuthUser, UpdateUser);

// @api/upload POST upload news
router
  .post("/shorts", uploadShorts.single("file"), isAuthUser, UploadShorts)
  .delete("/shorts/:id", isAuthUser, DeleteShorts)
  .put("/shorts/:id", uploadShorts.single("file"), isAuthUser, UpdateShorts)
  .get("/shorts/:id", SingleShorts);

// @api/GET all Shorts
router.get("/all/shorts", AllShorts);

// @api/approve-Shorts POST approve Shorts
// router.post("/approve-shorts/:id", isAuthUser, ApproveShorts);

// @api/upload POST upload news
router
  .post("/news", uploadNews.single("file"), isAuthUser, UploadNews)
  .delete("/news/:id", isAuthUser, DeleteNews)
  .put("/news/:id", uploadNews.single("file"), isAuthUser, UpdateNews)
  .get("/news/:id", SingleNews);

// @api/GET all news
router.get("/all/news", AllNews);

// @api/random/news GET RandomNews
router.get("/random/news", isAuthUser, RandomNews);

// @api/GET all approved news
router.get("/approved/news", ApprovedNews);

// @api/GET all pending news
router.get("/pending/news", PendingNews);

// @api/approve-news POST approve news
router.post("/approve-news/:id", isAuthUser, ApproveNews);

// @api/news/category GET news by category
router.get("/news/category/:id", GetNewsByCategory);

// @api/news/category GET news by category
router.get("/news/categoryName/:name", GetNewsByCategoryName);

// @api/news/author GET news by author
router.get("/news/author/:id", GetNewsByAuthor);

// @api/news/date GET news by date
router.get("/news/date/:date", GetNewsByDate);

// @api/news/location GET news by location
router.get("/news/location/:location", GetNewsByLocation);

// @api/news/hashtag GET news by hashtag
router.get("/news/hashtag/:hashtag", GetNewsByHashTag);

// @api/news/like POST like news
router.post("/news/like/:id", isAuthUser, NewsLikes);

// @api/news/comment POST NewsComments
router.post("/news/comment/:id", isAuthUser, NewsComments);

// @api/news/comment/delete DELETE NewsCommentDelete
router.delete(
  "/news/comment/delete/:id/:commentId",
  isAuthUser,
  NewsCommentDelete
);

// @api/folder POST create folder
router
  .post("/folder", isAuthUser, CreateFolder)
  .get("/folder", AllFolders)
  .delete("/folder", isAuthUser, DeleteFolder)
  .put("/folder", isAuthUser, UpdateFolder);

// @api/folder/:id GET open folder
router.get("/open/folder/:id", OpenFolder);

// @api/channel POST create channel
router
  .post("/channel", isAuthUser, CreateChannel)
  .get("/channel", AllChannels)
  .put("/channel", isAuthUser, UpdateChannel)
  .delete("/channel", isAuthUser, DeleteChannel);

// @api/channel/:id GET open channel
router.get("/open/channel/:id", GetChannel);

// @api/category POST create category
router
  .post("/category", isAuthUser, CreateCategory)
  .get("/category", AllCategories)
  .put("/category/:id", isAuthUser, UpdateCategory)
  .delete("/category/:id", isAuthUser, DeleteCategory);

// @api/category/:id GET open category
router.get("/category/:id", GetCategory);

// @api/news-category POST create news category
router
  .post("/news-category", upload.single("icon"), isAuthUser, CreateNewsCategory)
  .get("/news-category", AllNewsCategories)
  .put(
    "/news-category/:id",
    upload.single("icon"),
    isAuthUser,
    UpdateNewsCategory
  )
  .delete("/news-category/:id", isAuthUser, DeleteNewsCategory);

// @api/news-category/:id GET open news category
router.get("/news-category/:id", GetNewsCategory);

// @api/breaking-news POST create breaking news
router
  .post("/breaking-news", isAuthUser, CreateBreakingNews)
  .get("/breaking-news", AllBreakingNews)
  .put("/breaking-news/:id", isAuthUser, UpdateBreakingNews)
  .delete("/breaking-news/:id", isAuthUser, DeleteBreakingNews);

// @api/breaking-news/:id GET open breaking news
router.get("/breaking-news/:id", GetBreakingNews);

// @api/hashtag POST create advertisement
router
  .post("/add", upload.single("file"), isAuthUser, CreateAdd)
  .get("/add", AllAdds)
  .put("/add/:id", upload.single("file"), isAuthUser, UpdateAdd)
  .delete("/add/:id", isAuthUser, DeleteAdd);

// @api/hashtag/:id GET open advertisement
router.get("/add/:id", GetAdd);

// @api/eNewspaper/ POST create eNewspaper
router
  .post("/ePaper", upload.single("image"), isAuthUser, CreateENewspaper)
  .get("/ePaper", AllENewspapers)
  .put("/ePaper/:id", upload.single("image"), isAuthUser, UpdateENewspaper)
  .delete("/ePaper/:id", isAuthUser, DeleteENewspaper);

// @api/eNewspaper/ POST for specific city eNewspaper
router.get("/ePaper/city/:city", CityNewsPaper);

// @api/eNewspaper/:id GET open eNewspaper
router.get("/ePaper/:id", GetENewspaper);

// @api/eNewspaperCoordinates/ POST create eNewspaperCoordinates
router
  .post(
    "/ePaperCoord",
    upload.single("image"),
    isAuthUser,
    CreateENewspaperCoordinates
  )
  .get("/ePaperCoord", GetENewspaperCoordinates)
  .put(
    "/ePaperCoord/:id",
    upload.single("image"),
    isAuthUser,
    UpdateENewspaperCoordinates
  )
  .delete("/ePaperCoord/:id", isAuthUser, DeleteENewspaperCoordinates);

// @api/eNewspaperCoordinates/:id GET open eNewspaperCoordinates
router.get("/ePaperCoord/:id", GetENewspaperCoordinatesById);

// @api/userNews read update delete userNews
router
  .get("/userNews",  GetUserNews)
  .put("/userNews/:id", upload.single("file"), isAuthUser, UpdateUserNews)
  .delete("/userNews/:id", isAuthUser, DeleteUserNews);

// @api/userNews/:id GET open userNews
router.get("/userNews/:id", GetUserNewsById);

module.exports = router;
