const mongoose = require("mongoose");

const categoryModel = mongoose.Schema({
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  sortOrder: {
    type: Number,
  },
  showInMenu: {
    type: String,
  },
  showInChild: {
    type: String,
  },
  englishName: {
    type: String,
    unique: true,
  },
  hindiName: {
    type: String,
  },
  startingAlphabet: {
    type: String,
  },
  categoryUrl: {
    type: String,
    unique: true,
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

  child: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

module.exports = mongoose.model("Category", categoryModel);