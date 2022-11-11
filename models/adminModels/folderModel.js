const mongoose = require("mongoose");

const folderModel = new mongoose.Schema({
    folderName: {
        type: String,
        required: [true, "Folder name is required"],
        unique: true,
    },
    shorts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shorts"
    }],
    channels : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channels"
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model('Folders', folderModel);