import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "public" },
];
const categoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "sports" },
];

function VideoUploadPage() {
    const [videoTitle, setvideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [category, setcategory] = useState("File & Animation");
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) => {
        console.log(e.currentTarget);
        setvideoTitle(e.currentTarget.value);
    };
    const onDescription = (e) => {
        setvideoTitle(e.currentTarget.value);
    };
    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value);
    };
    const onCategoryChange = (e) => {
        setcategory(e.currentTarget.value);
    };
    const onDrop = (files) => {
        let formData = new FormData();

        const config = {
            header: { "content-type": "multipart/form-data" },
        };
        formData.append("file", files[0]);
        console.log(files);

        Axios.post("/api/video/uploadfiles", formData, config).then(response => {
            if (response.data.success) {
                console.log(response.data);
                console.log(response.data.filePath);
                console.log(response.data.fileName);
                
                let variable = {
                    url:response.data.url,
                    fileName:response.data.fileName
                }
                
                setFilePath(response.data.url)
                
                Axios.post("/api/video/thumbnail",variable).then(response => {
                    if(response.data.success){
                        
                        setDuration(response.data.fileDuration)
                        setThumbnailPath(response.data.url)
                        console.log("----------"+response.data.url)
                        
                    } else {
                        alert("썸내일 생성에 실패했습니다.")
                    }
                })
                    
            }else {
                alert("비디오 업로드를 실패했습니다.");
                console.log(response.data);
            }
        });
    };

    const onSubmit = () =>{
        e.preventDefault();
        // 하려던것을 방지 이 이후부터 우리가 하는것을 코딩하면 동작함
    }

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div>
                    <Title level={2}>upload video</Title>
                </div>
            </div>

            <Form onSubmit={onsubmit}>
                <div style={{ display: "flex",justifyContent:"space=between" }}>
                    {/* 드랍존 */}
                    <Dropzone onDrop={onDrop} multiple={false} maxSize={100000000000}>
                        {({ getRootProps, getInputProps }) => (
                            <div
                                style={{
                                    width: "300px",
                                    height: "240px",
                                    border: "1px solid lightgray",
                                    alignItems: "center",
                                    justifyContent: "cener",
                                }}
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: "3rem" }} />
                            </div>
                        )}
                    </Dropzone>

                    {/* 썸네일 */}
                    {ThumbnailPath &&
                    <div>
                        <img src={`http://localhost:5888/${ThumbnailPath}`} alt="Thumbnail" />
                    </div>
                    }
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
                <Button type="primary" size="large" onClick={onSubmits}>
                    submit
                </Button>
            </Form>
        </div>
    );
}

export default VideoUploadPage;
