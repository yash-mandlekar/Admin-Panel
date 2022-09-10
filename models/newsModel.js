const mongoose = require("mongoose");

const newsModel =  mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title field must not be empty"],
            minlength: [4, "Title should have atleast 4 characters"],
        },
        description: {
            type: String,
            required: [true, "description field must not be empty"],
            minlength: [6, "description should have atleast 6 characters"],
        },
        file: {
            contentType: Buffer,
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
        category: [ {
            _id: false,
            categoryID: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Category'
            }
        } ],
        createdat: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("News", newsModel);


