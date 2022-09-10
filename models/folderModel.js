const mongoose = require("mongoose");

const folderModel = new mongoose.Schema({
    folderName: {
        type: String,
        required: [true, "Folder name is required"],
    },
    news : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "News"
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model('Folders', folderModel);