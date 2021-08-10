const express = require("express");
const router = express.Router();
const path = require("path");
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");
const { json } = require("body-parser");

(function () {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
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
            return cb(res.status(400).end("only mp4 is allowed"), false);
        }
        cb(null, true);
    },
});
const upload = multer({ storage: storage }).single("file");

//=================================
//             video
//=================================



//비디오 정보들을 저장한다.
router.post("/uploadVideo", (req, res) => {
    //video.js const variables 의 담긴 모든게 req.body 안에 담긴다.
    const video = new Video(req.body);

    video.save((err, doc) => {
        if (err) return res.status(400).json({ success: false, err });
        res.status(200).json({
            success: true,
        });
    });
});

//비디오를 서버에 저장한다.
router.post("/uploadfiles", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename });
    });
});


//썸네일 서버에 저장한다.
router.post("/thumbnail", (req, res) => {
    const videoPath = path.join(process.cwd(), "uploads/" + req.body.fileName);
    // 썸네일 생성 하고 비디오 러닝타임 가져오기
    let filePath = "";
    let fileDuration = "";
    ffmpeg.ffprobe(videoPath, function (err, metadata) {
        if (err) {
            console.error(err);
        }
        fileDuration = metadata.format.duration;
    });


    ffmpeg.setFfmpegPath("C:\\Program Files\\ffmpeg\\bin\\ffmpeg");
    ffmpeg.setFfprobePath("C:\\Program Files\\ffmpeg\\bin\\ffprobe.exe");
    //ffmpeg.setFfprobePath("./ffprobe");

    //썸네일생성
    ffmpeg(videoPath)
        .on("filenames", function (filenames) {
            console.log(filenames);
            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on("end", function () {
            console.log("screenshots taken" + filePath);
            console.log("+_+_+_+_" + fileDuration);
            return res.json({ success: true, url: filePath, fileDuration: fileDuration });
        })
        .on("error", function (err) {
            console.error(err);
            return res.json({ success: false, err });
        })
        .screenshots({
            count: 3,
            folder: "uploads/thumbnails",
            size: "320x240",
            filename: "thumbnail-%b.png",
        });
});


//비디오 정보들을 DB에서 가져와서 클라이언트에 보낸다.
router.get("/getvideos", (req, res) => {
    Video.find()
        .populate("writer")
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, videos });
        });
});

router.post("/getVideoDetail", (req, res) => {
    console.log(req.body.videoId)
    Video.findOne({ "_id": req.body.videoId })
        .populate("writer")
        .exec((err, VideoDetail) => {
            if (err) return res.status(400).send(err);
            return res.status(200).json({ success: true, VideoDetail });
        });
});

module.exports = router;
