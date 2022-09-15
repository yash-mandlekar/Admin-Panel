const mongoose = require("mongoose");

const categoryModel = mongoose.Schema(
    {
        name: {                     
            type: String,
            required: [true, "Name field must not be empty"],
        },
        subCategory: [{
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categoryModel);


