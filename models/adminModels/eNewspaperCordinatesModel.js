const mongoose = require("mongoose");

const eNewspaperCordinatesModel = new mongoose.Schema({
    city: {
        type: String,
        required: [true, "City is required"],
    },
    pageNo: {
        type: Number,
        required: [true, "Page number is required"],
    },
    image:{
        type: String,
        required: [true, "Image is required"],
    },
    date: {
        type: String,
        default: new Date().toLocaleDateString(),
        required: [true, "Date is required"],
    },
    leftCoordinate: {
        type: Number,
        required: [true, "Left coordinate is required"],
    },
    topCoordinate: {
        type: Number,
        required: [true, "Top coordinate is required"],
    },
    sectionWidth: {
        type: Number,
        required: [true, "Section width is required"],
    },
    sectionHeight: {
        type: Number,
        required: [true, "Section height is required"],
    },
    newsUrl: {
        type: String,
        required: [true, "News URL is required"],
    }
});

module.exports = mongoose.model("eNewspaperCordinates", eNewspaperCordinatesModel);