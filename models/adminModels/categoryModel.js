const mongoose = require("mongoose");

const categoryModel = mongoose.Schema({
  parentCategory: {
    type: String,
    default: "",
    required: [true, "Category name is required"],
  },
  sortOrder: {
    type: Number,
    required: [true, "Sort order is required"],
  },
  showInMenu: {
    type: Boolean,
    default: false,
  },
  showInChild: {
    type: Boolean,
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
