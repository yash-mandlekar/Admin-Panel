const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const useToken = require("../../utils/useToken");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const AppUser = require("../../models/userModels/appUserModel");
const fs = require("fs"); // File System
const ErrorHandler = require("../../utils/ErrorHandler");
// const { constants } = require("fs/promises");

exports.GetHomepage = (req, res, next) => {
    res.status(200).json({ message: "Welcome to the homepage" });
};

exports.PostRegisterAppUser = catchAsyncErrors(async (req, res, next) => {
    const user = await AppUser.create(req.body);
    useToken(user, 201, res);
});

exports.PostLoginAppUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }

    const usercomp = await AppUser.findOne({ email }).select("+password");
    const user = await AppUser.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
    }

    const isPasswordMatching = await usercomp.comparePassword(password);

    if (!isPasswordMatching) {
        return next(new ErrorHandler("Incorrect email or password", 400));
    }

    useToken(user, 200, res);
});

exports.PostRefreshAppToken = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.body;

    if (!token) {
        return next(new ErrorHandler("Your are not authenticated", 401));
    }

    jwt.verify(token, process.env.REFRESH_SECRET, async (err, user) => {
        if (err) {
            return next(new ErrorHandler("Your are not authenticated", 401));
        }
        const refresh_user = await AppUser.findById(user.id);
        useToken(refresh_user, 200, res);
    });
});

exports.LogoutAppUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
});

exports.ForgotPasswordApp = catchAsyncErrors(async (req, res, next) => {
    const user = await AppUser.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User does not exist", 400));
    }

    const resetToken = user.createPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `http://localhost:4000/user/reset/${resetToken}`;

    const message = `Password reset token is ${resetPasswordUrl}`;

    try {
        // email sending logic goes here
        res.status(200).json({
            status: "success",
            message,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler("Error in reset token", 500));
    }
});

exports.ResetPasswordApp = catchAsyncErrors(async (req, res, next) => {
    const resetPaswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    const user = await AppUser.findOne({
        resetPasswordToken: resetPaswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler("Invalid Password Token or Token has been expired", 400)
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    useToken(user, 200, res);
});

exports.ChangePasswordApp = catchAsyncErrors(async (req, res, next) => {
    try {
        const { password, newPassword, email } = req.body;
        const User = await appUserModel.findOne({ email }).select("+password").exec();
        if (!User) return res.status(401).send("User not found.");
        const matchpassword = comparepassword(password, User.password);
        if (!matchpassword) return res.status(401).send("Incorrect Password.");

        User.password = hashPassword(newPassword);
        await User.save();
        res.status(201).json({ ok: true });
    } catch (err) {
        res.status(500).json(err.message);
    }
});

exports.GetAppUser = catchAsyncErrors(async (req, res, next) => {
    const user = await AppUser.findById(req.body.id);
    res.status(200).json({
        status: "success",
        user,
    });
}
);

exports.UpdateAppUser = catchAsyncErrors(async (req, res, next) => {
    const user = await AppUser.findByIdAndUpdate(req.body.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        status: "success",
        user,
    });
});

exports.DeleteAppUser = catchAsyncErrors(async (req, res, next) => {
    const user = await AppUser.findByIdAndDelete(req.body.id);

    res.status(200).json({
        status: "success",
        user,
    });
});

exports.UpdateProfilePic = catchAsyncErrors(async (req, res, next) => {
    const {profileImage,userId, fileType } = req.body;
    const user = await AppUser.findOne({ _id: userId });
    if (user.profileImage.split("/")[2] !== profileImage) {
        fs.unlink(`./public/profilePics/${user.profileImage.split("/")[2]}`, (err) => {
            if (err) {
            }
        });
    }
    user. profileImage = `/profilePics/${req.file.filename}`;
    console.log(`/profilePics/${req.file.filename}`);
    user.fileType= fileType ? fileType : req.file.mimetype.split("/")[0];
    await user.save();
    res.status(201).json({
    success: true,
    message: "Image updated successfully",
    user
});


});























