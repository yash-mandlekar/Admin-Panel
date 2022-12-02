const mongoose = require('mongoose');

const advertisementModel = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    file: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    targetAudience: {
        type: String,
        required: true,
    },
    advertisementLocation: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    sortOrder: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Advertisement', advertisementModel);