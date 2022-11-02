const mongoose = require("mongoose");

const categoryModel = mongoose.Schema({
  parentCategory: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: Number,
    required: [true, "Sort order is required"],
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
    required: [true, "English name is required"], 
  },
  hindiName: {
    type: String,
    required: [true, "Hindi name is required"],
  },
  startingAlphabet: {
    type: String,
    required: [true, "Starting alphabet is required"],
  },
  categoryUrl: {
    type: String,
    required: [true, "Category url is required"],
  },
  metaTitle: {
    type: String,
    required: [true, "Meta title is required"],
  },
  metaDescription: {
    type: String,
    required: [true, "Meta description is required"],
  },

  news: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
    },
    ],
    

});

module.exports = mongoose.model("Category", categoryModel);
