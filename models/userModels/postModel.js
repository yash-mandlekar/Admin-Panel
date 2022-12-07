const mongoose = require('mongoose')


const postModel = mongoose.Schema({
    location: {
        type: String,
    },
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
        default: "",
    },
    fileType: {
        type: String,
        default: "",
    },
    live: {
        type: Boolean,
        default: false,
    },
    name:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AppUser'
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AppUser'
    }],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'AppUser'
        },
        comment:{type:String}
    }]
    })

module.exports = mongoose.model('Post', postModel);
