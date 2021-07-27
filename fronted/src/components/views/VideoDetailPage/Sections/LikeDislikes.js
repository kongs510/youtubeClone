import React, { useState } from 'react'
import { Tooltip, Icon } from 'antd';
import { useEffect } from 'react';
import Axios from 'axios';

function LikeDislikes(props) {
    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikeAction, setDisLikeAction] = useState(null)

    let variable = {}
    if (props.video) {
        variable = { videoId: props.videoId, userId: props.userId }
    } else {
        variable = { commentId: props.commentId, userId: props.userId }
    }

    useEffect(() => {
        Axios.post("/api/like/getLikes", variable)
            .then(response => {
                if (response.data.success) {
                    //좋아요를 누른갯수
                    setLikes(response.data.likes.length)
                    //내가 눌렀는지 확인
                    response.data.likes.map(like => {
                        if (like.userId === props.userId) {
                            setLikeAction('liked')
                        }
                    })
                } else {
                    alert("좋아요를 가져오지 못했습니다.")
                }
            })

        Axios.post("/api/like/getDislikes", variable)
            .then(response => {
                if (response.data.success) {
                    //싫어요를 누른갯수
                    setDislikes(response.data.dislikes.length)
                    //내가 눌렀는지 확인
                    response.data.dislikes.map(dislike => {
                        if (dislike.userId === props.userId) {
                            setDisLikeAction('disliked')
                        }
                    })
                } else {
                    alert("싫어요를 가져오지 못했습니다.")
                }
            })
    }, [])

    const onLike = () => {

        if (LikeAction === null) {
            Axios.post("/api/like/upLike", variable)
                .then(response => {
                    if (response.data.success) {

                        setLikes(Likes + 1)
                        setLikeAction("Liked")

                        if (DisLikeAction !== null) {
                            setDisLikeAction(null)
                            setDislikes(Dislikes - 1)
                        }
                    } else {
                        alert("좋아요를 올리지 못하였습니다.")
                    }
                })
        } else {
            Axios.post("/api/like/unLike", variable).then(response => {
                if (response.data.success) {
                    setLikes(Likes - 1)
                    setLikeAction(null)
                } else {
                    alert("좋아요를 내리지 못하였습니다.")
                }
            })
        }
    }

    const onDisLike = () => {

        if (DisLikeAction !== null) {

            Axios.post("/api/like/unDisLike", variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes - 1)
                        setDisLikeAction(null)

                    } else {
                        alert("싫어요를 올리지 못하였습니다.")
                    }
                })

        } else {

            Axios.post("/api/like/upDisLike", variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikes(Dislikes + 1)
                        setDisLikeAction('disliked')

                        //If dislike button is already clicked
                        if (LikeAction !== null) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }
                    } else {
                        alert("싫어요를 내리지 못하였습니다.")
                    }
                })
        }
    }


    return (
        <React.Fragment>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                        onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span>&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DisLikeAction === 'disliked' ? 'filled' : 'outlined'}
                        onClick={onDisLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
            </span>
        </React.Fragment>
    )
}

export default LikeDislikes
