import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "public" },
];
const categoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "music" },
  { value: 3, label: "Pets & Animals" },
  { value: 4, label: "sports" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user); //state 가서 user의 정보를 가져와서 user의 담겨진다.
  const [videoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [category, setCategory] = useState("File & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };
  const onDescription = (e) => {
    setDescription(e.currentTarget.value);
  };
  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };
  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };
  const onDrop = (files) => {
    let formData = new FormData();

    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    Axios.post("/api/video/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        let variable = {
          url: response.data.url,
          fileName: response.data.fileName,
        };
        console.log(response.data.filePath);
        setFilePath(response.data.filePath);

        Axios.post("/api/video/thumbnail", variable).then((response) => {
          if (response.data.success) {
            setDuration(response.data.fileDuration);
            setThumbnailPath(response.data.url);
            console.log("썸내일 생성 성공" + response.data.url);
          } else {
            alert("썸내일 생성에 실패했습니다.");
          }
        });
      } else {
        alert("비디오 업로드를 실패했습니다.");
      }
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    // 하려던것을 방지 이 이후부터 우리가 하는것을 코딩하면 동작함

    const variables = {
      //리덕스를 통해 가져온다 (리덕스 훅)
      writer: user.userData._id,
      title: videoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    //라우터 만들어야한다. /api/video/uploadVideo
    Axios.post("/api/video/uploadVideo", variables) //variables 들을 request 보내면 response를 받는다.
      .then((response) => {
        if (response.data.success) {
          message.success("성공적으로 업로드 했습니다.");

          setTimeout(() => {
            props.history.push("/");
          }, 1000);
        } else {
          alert("비디오 업로드에 실패했습니다.");
        }
      });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div>
          <Title level={2}>upload video</Title>
        </div>
      </div>

      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* 드랍존 */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={100000000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon
                  type="plus"
                  style={{
                    fontSize: "3rem",
                    paddingLeft: "8rem",
                    paddingTop: "6rem",
                  }}
                />
              </div>
            )}
          </Dropzone>

          {/* 썸네일 */}
          {ThumbnailPath && (
            <div>
              <img
                src={`https://localhost:5888/${ThumbnailPath}`}
                alt="Thumbnail"
              />
            </div>
          )}
        </div>
        <br />
        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={videoTitle} />
        <br />
        <br />
        <label>Description</label>
        <TextArea onChange={onDescription} value={Description} />
        <br />
        <br />
        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <select onChange={onCategoryChange}>
          {categoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="primary" size="large" onClick={onSubmit}>
          submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
