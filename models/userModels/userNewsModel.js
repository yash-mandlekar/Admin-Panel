const mongoose = require("mongoose");
const userNewsModel = mongoose.Schema(
  {
    message: {
      type: String,
      default: "",
    },

    file: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppUser",
    },

    createdat: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserNews", userNewsModel);
