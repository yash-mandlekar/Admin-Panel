//breaking news schema
const mongoose = require("mongoose");
const breakingNewsModel = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title field must not be empty"],
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("BreakingNews", breakingNewsModel);