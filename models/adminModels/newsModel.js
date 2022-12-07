const mongoose = require("mongoose");
const newsModel = mongoose.Schema(
  {
    metaTitle: {
      type: String,
      required: [true, "Title field must not be empty"],
    },

    shortDescription: {
      type: String,
      required: [true, "Short Description field must not be empty"],
    },

    metaDescription: {
      type: String,
      required: [true, "description field must not be empty"],
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

    showInSlider: {
      type: String,
      default: false,
    },

    sliderPriority: {
      type: Number,
      default: 0,
    },

    publishDate: {
      type: Date,
      default: Date.now,
    },

    latestNews: {
      type: String,
      default: false,
    },

    latestNewsPriority: {
      type: Number,
      default: 0,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    aboutImage: {
      type: String,
      default: "",
    },

    imageSource: {
      type: String,
      default: "",
    },

    newsUrl: {
      type: String,
      default: "",
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewsCategory",
      },
    ],

    hashTags: [
      {
        type: String,
      },
    ],

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
    createdat: {
      type: Date,
      default: Date.now,
    },

    approved: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsModel);
