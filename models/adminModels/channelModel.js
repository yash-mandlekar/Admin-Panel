const mongoose = require("mongoose");

const channelModel = new mongoose.Schema({
    channelName: {
        type: String,
        required: [true, "Channel name is required"],
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    type: {
        type: String,
        required: [true, "Type is required"],
    },
    layout: {
        type: String,
        required: [true, "Layout is required"],
    },
    titlePosition: {
        type: String,
        required: [true, "Title position is required"],
    },
    top: {
        type: String,
        required: [true, "Top is required"],
    },
    play: {
        type: String,
        required: [true, "Play is required"],
    },
    partition: {
        type: Number,
        required: [true, "Partition is required"],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model('Channels', channelModel);