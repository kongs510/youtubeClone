const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//video table 생성
const videosSchema = mongoose.Schema({
//db Vo 같은성격??

    writer: {
        type:mongoose.Schema.Types.ObjectId,
        //아이디 만을 가져와도 User.js 안에 있는 스키마를 다가져옴
        ref:"User"
    },
    title:{
        type:String,
        maxlength:50
    },
    description:{
        type:String
    },
    privacy:{
        type:Number
        // 0 프라이빗 or 1 퍼블릭 둘중하나
    },
    category:{
        type:String
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
}, {timestamps: true})




const Video = mongoose.model('User', videosSchema);

module.exports = { Video }