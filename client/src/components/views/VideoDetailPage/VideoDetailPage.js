import React, { useState, useEffect } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscriber from "./Sections/Subscriber";
import Comment from "./Sections/Comment";
import LikeDislikes from "./Sections/LikeDislikes";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;

  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);
  const variable = { videoId: videoId };

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.VideoDetail);
        setVideoDetail(response.data.VideoDetail);
      } else {
        alert("비디오 정보를 가져오길 실패했습니다.");
      }
    });
    Axios.post("/api/comment/getComments", variable).then((response) => {
      if (response.data.success) {
        setComments(response.data.comments);
        console.log(response.data.comments);
      } else {
        alert("코멘트 정보를 가져오지 못했습니다.  ");
      }
    });
  }, []);
  if (VideoDetail.writer) {
    const SubscribeButton = VideoDetail.writer.token && (
      <Subscriber
        userTo={VideoDetail.writer._id}
        userFrom={localStorage.getItem("userId")}
      />
    );

    const refreshFunction = (newComment) => {
      setComments(Comments.concat(newComment));
    };
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} cs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            {/* <video src={`http://localhost:5888/${VideoDetail.filePath}`} controls /> */}
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5888/${VideoDetail.filePath}`}
              controls
            ></video>
            <List.Item actions={[<LikeDislikes video uerId={localStorage.getItem("userId")} videoId={videoId} />, SubscribeButton]}>
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>
            <Comment
              refreshFunction={refreshFunction}
              Comments={Comments}
              postId={videoId}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;
