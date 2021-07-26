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
                    response.data.likes.length.map(like => {
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
                    response.data.dislikes.length.map(dislike => {
                        if (dislike.userId === props.userId) {
                            setDisLikeAction('disliked')
                        }
                    })
                } else {
                    alert("싫어요를 가져오지 못했습니다.")
                }
            })

    }, [])
    return (
        <React.Fragment>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon type="like"
                        theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                    // onClick={onLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
            </span>&nbsp;&nbsp;
            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    <Icon
                        type="dislike"
                        theme={DisLikeAction === 'disliked' ? 'filled' : 'outlined'}
                    // onClick={onDisLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
            </span>
        </React.Fragment>
    )
}

export default LikeDislikes
