const mongoose = require("mongoose");

const folderModel = new mongoose.Schema({
    folderName: {
        type: String,
        required: [true, "Folder name is required"],
        unique: true,
    },
    news : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "News"
    }],
    channels : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel"
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model('Folders', folderModel);