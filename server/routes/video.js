const express = require("express");
const process = require("process");
const path = require("path");
const router = express.Router();
// const { Video } = require("../models/Video");

//const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");


(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== ".mp4") {
            return cb(res.status(400).end("only jpg, png, mp4 is allowed"), false);
        }
        cb(null, true);
    },
});
const upload = multer({ storage: storage }).single("file");

//=================================
//             video
//=================================

//비디오를 서버에 저장한다.
router.post("/uploadfiles", (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
});

//썸네일 서버에 저장한다.
router.post("/thumbnail", (req, res) => {
    const videoPath = path.join(process.cwd(), "uploads/"+req.body.fileName);
    // 썸네일 생성 하고 비디오 러닝타임 가져오기
    let filePath = ""
    let fileDuration = "";
    ffmpeg.ffprobe(videoPath, function(err,metadata) {
        if (err) {
            console.error(err);
        }
        console.dir(metadata);
        console.log(metadata.streams.duration);

        fileDuration = metadata.streams.duration;
        console.log(fileDuration);
    });


    
    ffmpeg.setFfmpegPath("C:\\Program Files\\ffmpeg\\bin\\ffmpeg");
    ffmpeg.setFfprobePath("C:\\Program Files\\ffmpeg\\bin\\ffprobe.exe");
    //ffmpeg.setFfprobePath("./ffprobe");

    //썸네일생성
    ffmpeg(videoPath)
    .on("filenames",function (filenames) {
        console.log("will generate"+filenames.join(","))
        console.log(filenames)
        filePath = "uploads/thumbnails/"+filenames[0]
    })
    .on("end",function () {
        console.log("screenshots taken");
        return res.json({ success: true, url:filePath, fileDuration: fileDuration});
    })
    .on("error",function (err) {
        console.error(err);
        return res.json({success:false,err});
    })
    .screenshots({
        count:3,
        folder: "uploads/thumbnails",
        size:"320x240",
        filename:"thumbnail-%b.png"
    });
});

module.exports = router;
