const mongoose = require("mongoose");

const newsCategoryModel = mongoose.Schema({
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewsCategory",
  },                        
  sortOrder: {
    type: Number,
  },
  icon:{
    type: String,
    default: "",
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
      ref: "NewsCategory",
    },
  ],
});

module.exports = mongoose.model("NewsCategory", newsCategoryModel);