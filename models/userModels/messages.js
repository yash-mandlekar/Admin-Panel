const mongoose = require("mongoose");
const messageModel = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AppUser",
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AppUser",
    },
    message: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
module.exports = mongoose.model("Message", messageModel);