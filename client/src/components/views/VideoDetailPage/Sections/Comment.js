import Axios from "axios";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";

function Comment(props) {
  //Url에서 가져온다!
  const user = useSelector((state) => state.user);
  const [commentValue, setCommentValue] = useState("");
  const handleClick = (e) => {
    setCommentValue(e.currentTarget.value);
    //타이핑한 글자가 입력되게 이벤트 객체를 이용
  };

  const onSubmit = (e) => {
    e.preventDefault();
    //리플레쉬 방지

    const variables = {
      content: commentValue,
      writer: user.userData._id,
      //기존에는 localStorage에서 가져왔는데 이번에는 리덕스 에서 가져오는것으로!
      postId: props.postId,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
      } else {
        alert("코멘트를 저장하지 못했습니다.");
      }
    });
  };
  return (
    <div>
      <br />
      <p>Replies</p>
      <hr />

      <form style={{ display: "flex" }} onClick={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={handleClick}
          value={commentValue}
          placeholder="코멘트를 작성해주세요"
        />
        <br />
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
