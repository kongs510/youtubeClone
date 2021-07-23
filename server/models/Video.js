const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//video table 생성
//db Vo 같은성격??

const videoSchema = mongoose.Schema({

    writer: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    title:{
        type:String,
        maxlength:50
    },
    description:{
        type:String,
    },
    privacy:{
        type:Number,
    },
    category:{
        type:String,
    }, 
    views:{
        type:Number,
        default: 0
    },
    duration:{
        type:String
    },
    thumbnail:{
        type:String
    },
}, { timestamps: true })




const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }