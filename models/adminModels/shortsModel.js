const mongoose = require("mongoose");

const shortsModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title field must not be empty"],
    },
    file: {
      type: Buffer,
      default: "",
    },
    fileType: {
      type: String,
      default: "",
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channels",
      },
    ],

    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folders",
    },
    createdat: {
      type: Date,
      default: Date.now,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shorts", shortsModel);
