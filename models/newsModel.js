const mongoose = require("mongoose");

const newsModel = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title field must not be empty"],
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
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        category: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        }],
        createdat: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("News", newsModel);


