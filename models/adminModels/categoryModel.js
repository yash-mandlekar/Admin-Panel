const mongoose = require("mongoose");

const categoryModel = mongoose.Schema({
  parentCategory: {
    type: String,
    default: "",
    // unique: true,
  },
  sortOrder: {
    type: Number,
  },
  showInMenu: {
    type: String,
    default: false,
  },
  showInChild: {
    type: String,
    default: false,
  },
  englishName: {
    type: String,
  },
  hindiName: {
    type: String,
  },
  startingAlphabet: {
    type: String,
  },
  categoryUrl: {
    type: String,
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },

  news: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
    },
  ],
});

module.exports = mongoose.model("Category", categoryModel);
