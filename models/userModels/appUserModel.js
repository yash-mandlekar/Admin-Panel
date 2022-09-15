const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const appUserModel = mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Name mube be at least 4 characters long."],
        required: [true, "Name field can not empty."],
    },
    email: {
        type: String,
        required: [true, "Email field can not empty."],
        validate: [validator.isEmail, "Invalid email"],
    },

    dateOfBirth: {
        type: Date,
        required: [true, "Date of birth field must not be empty"],
    },
    phone: {
        type: String,
        required: [true, "Phone field must not be empty"],
    },
    gender: {
        type: String,
        required:true,
    },
    password: {
        type: String,
        minlength: [6, "Password mube be at least 6 characters long."],
        required: [true, "Password field can not empty."],
        select: false,
    },
    profileImage: {
        type: String,
        default: "default.jpg",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
   
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postModel'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appUserModel'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appUserModel'
    }],
    followrequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'appUserModel'
    }],

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    refreshToken: String,
  });
  appUserModel.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
  
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  appUserModel.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };
  
  appUserModel.methods.generateToken = function () {
    const access_token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      // expiresIn: Math.floor(Date.now() / 1000) + (60 * 60),
    });
  
    const refresh_token = jwt.sign({ id: this._id }, process.env.REFRESH_SECRET, {
      expiresIn: "24h",
    });
    this.refreshToken = refresh_token;
  
    return access_token;
  };
  
  appUserModel.methods.createPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() * 86400000;
  
    return resetToken;
  };


module.exports = mongoose.model("AppUser", appUserModel);