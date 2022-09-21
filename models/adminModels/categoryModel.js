const mongoose = require("mongoose");

const categoryModel = mongoose.Schema(
    {
        name: {                     
            type: String,
            required: [true, "Name field must not be empty"],
            unique: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categoryModel);


