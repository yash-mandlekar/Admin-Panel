const mongoose = require("mongoose");

const newsModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title field must not be empty"],
    },
    subtitle: {
      type: String,
    },
    
    description: {
      type: String,
      required: [true, "description field must not be empty"],
    },
    file: {
      type: String,
      default: "",
    },
    fileType: {
      type: String,
      default: "",
    },

    location: {
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

    category:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },

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

module.exports = mongoose.model("News", newsModel);
