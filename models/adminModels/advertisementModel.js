const mongoose = require('mongoose');

const advertisementModel = mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    file: {
        type: String,
        required: false,
    },
    link: {
        type: String,
        required: false,
    },
    targetAudience: {
        type: String,
        required: false,
    },
    advertisementLocation: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    sortOrder: {
        type: Number,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Advertisement', advertisementModel);