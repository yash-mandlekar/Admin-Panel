const express = require("express")
const router = express.Router();

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
router.post("/forgot", isAuthUser, ForgotPasswordApp)

// @api /user/reset/:resetToken POST login user
router.post("/reset/:resetToken", isAuthUser, ResetPasswordApp)

// @api /user/change password POST login user
router.post("/change", isAuthUser, ChangePasswordApp)



module.exports = router;