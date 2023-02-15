const mongoose = require("mongoose");

const postModel = mongoose.Schema({
  location: {
    type: String,
  },
  caption: {
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
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppUser",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AppUser",
      },
      comment: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", postModel);
