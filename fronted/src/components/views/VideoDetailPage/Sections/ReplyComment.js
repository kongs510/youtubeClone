import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [openReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {
        let commentNumber = 0;
        props.Comments.map((comment) => {
            if (comment.responseTo === props.parentCommentId) {
                commentNumber++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [props.Comments])

    let renderReplyComment = (parentCommentId) =>
        props.Comments.map((comment, index) => (
            <React.Fragment>
                {comment.responseTo === parentCommentId &&
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        < SingleComment key={index}
                            refreshFunction={props.refreshFunction}
                            comment={comment}
                            postId={props.postId} />
                        <ReplyComment Comments={props.Comments} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />
                    </div>
                }
            </React.Fragment>
        ))

    const onHandleChange = () => {
        setOpenReplyComments(!openReplyComments)

    }

    return (
        <div>
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: "14px", margin: 0, color: "gray" }} onClick={onHandleChange}>
                    view {ChildCommentNumber} more comment(s)
                </p>}
            {openReplyComments &&
                renderReplyComment(props.parentCommentId)}

            vvvvvvvvv
        </div>
    )
}

export default ReplyComment
