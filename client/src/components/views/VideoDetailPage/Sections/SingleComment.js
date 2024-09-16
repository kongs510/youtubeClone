import React from "react";
import { Comment, Avatar, Button, Input } from "antd";
import { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import LikeDislikes from "./LikeDislikes";

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };
  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value);
    console.log(e.currentTarget.value)
  };

  const actions = [
    <>
      <LikeDislikes uerId={localStorage.getItem("userId")} commentId={props.comment._id} />
      <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
        Reply to
      </span>,
    </>
  ];

  const onSubmit = (e) => {

    e.preventDefault();

    //댓글의 대한 유저정보와 댓글의 대한 내용 필요
    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      //기존에는 localStorage에서 가져왔는데 이번에는 리덕스 에서 가져오는것으로!
      postId: props.postId,
      responseTo: props.comment._id,
    };


    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue("");
        setOpenReply(false)
        props.refreshFunction(response.data.result);
      } else {
        alert("코멘트를 저장하지 못했습니다.");
      }
    });
  };
  console.log(props.comment);
  console.log(user.userData);
  return (
    <div>
      <Comment
        actions={actions}
        // author={props.comment.writer.name}
        // avatar={<Avatar src={props.comment.writer.image} alt="image" />}
        content={<p>{props.comment.content}</p>}
      />
      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="코멘트를 작성해주세요"
          />
          <br />
          <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
