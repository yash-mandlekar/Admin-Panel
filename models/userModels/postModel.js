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
    name:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        },
        comment:{type:String}
    }]
    })

module.exports = mongoose.model('Post', postModel);
