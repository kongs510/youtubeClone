const express = require("express");
const router = express.Router();

const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//=================================
//             like
//=================================



router.post("/getLikes", (req, res) => {

    let variable = {}
    if (req.body.VideoId) {
        variable = { videoId: req.body.VideoId }
    } else {
        variable = { commentId: req.body.commentId }
    }
    Like.find(variable).exec((err, likes) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, likes });
    });
});


router.post("/getDislikes", (req, res) => {

    let variable = {}
    if (req.body.VideoId) {
        variable = { videoId: req.body.VideoId }
    } else {
        variable = { commentId: req.body.commentId }
    }
    Dislike.find(variable).exec((err, dislikes) => {
        if (err) return res.status(400).send(err);
        res.status(200).json({ success: true, dislikes });
    });
});


router.post("/upLike", (req, res) => {

    let variable = {}
    if (req.body.VideoId) {
        variable = { videoId: req.body.VideoId, userId: req.body.useId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.useId }
    }
    // 좋아요 클릭 db에 저장
    const like = new Like(variable)


    like.save((err, likeResult) => {
        if (err) return res.json({ success: false, err })

        Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
        //싫어요가 클릭되어 있는 상태라면 싫어요 1 줄여줍니다.
    });
})

router.post("/unLike", (req, res) => {

    let variable = {}

    if (req.body.VideoId) {
        variable = { videoId: req.body.VideoId, userId: req.body.useId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.useId }
    }

    Like.findOneAndDelete(variable)
        .exec((err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
});

router.post("/unDislike", (req, res) => {

    let variable = {}

    if (req.body.VideoId) {
        variable = { videoId: req.body.VideoId, userId: req.body.useId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.useId }
    }

    Dislike.findOneAndDelete(variable)
        .exec((err, result) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
});

router.post("/upDisLike", (req, res) => {

    let variable = {}

    if (req.body.VideoId) {
        variable = { videoId: req.body.VideoId, userId: req.body.useId }
    } else {
        variable = { commentId: req.body.commentId, userId: req.body.useId }
    }

    // 싫어요 클릭 db에 저장
    const DisLike = new Dislike(variable)
    DisLike.save((err, disLikeResult) => {
        if (err) return res.json({ success: false, err })

        Like.findOneAndDelete(variable).exec((err, likeResult) => {
            if (err) return res.status(400).json({ success: false, err })
            res.status(200).json({ success: true })
        })
        //싫어요가 클릭되어 있는 상태라면 싫어요 1 줄여줍니다.
    });
})


module.exports = router;
