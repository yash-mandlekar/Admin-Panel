const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userModel = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [2, "Username must be at least 3 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: [validator.isEmail, "Email is not valid"],
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
  },
  gender: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: [true, "Country field must not be empty"],
  },
  state: {
    type: String,
    required: [true, "State field must not be empty"],
  },
  city: {
    type: String,
    required: [true, "City field must not be empty"],
  },
  pincode: {
    type: String,
    required: [true, "Pincode field must not be empty"],
  },
  mobile: {
    type: Number,
    required: [true, "Mobile field must not be empty"],
    minlength: [10, "Mobile should have atleast 10 characters"],
  },
  role: {
    type: String,
    default: "repoter",
  },
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
    },
  ],
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
  profileImage: {
    type: String,
    default: "/images/avtar.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  child: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
   
  news: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
    }
  ],
  shorts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shorts",
    },
  ],

  folders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folders",
    },
  ],

  channels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channels",
    },
  ],

  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],

  newsCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewsCategory",
    },
  ],

  

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  refreshToken: String,
});

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userModel.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userModel.methods.generateToken = function () {
  const access_token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    // expiresIn: Math.floor(Date.now() / 1000) + (60 * 60),
  });

  const refresh_token = jwt.sign({ id: this._id }, process.env.REFRESH_SECRET, {
    // expiresIn: "24h",
  });
  this.refreshToken = refresh_token;

  return access_token;
};

userModel.methods.createPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() * 86400000;

  return resetToken;
};

module.exports = mongoose.model("User", userModel);
