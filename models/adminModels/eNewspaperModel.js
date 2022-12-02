const mongoose = require("mongoose");

const eNewspaperModel = new mongoose.Schema({
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
});

module.exports = mongoose.model("eNewspaper", eNewspaperModel);