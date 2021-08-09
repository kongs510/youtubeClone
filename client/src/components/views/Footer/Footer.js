import React from 'react'
import { Icon } from 'antd';
// import Icon from '@ant-design/icons';

function Footer() {
    return (
        <div style={{
            background: "white",
            padding: "0 20px", borderBottom: "solid 1px #e8e8e8",
            overflow: "auto",
            boxShadow: "0 0 30px #f3f1f1",
            height: '80px', display: 'flex',
            flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', fontSize: '1rem'
        }}>
            <p> YouTube coding   <Icon type="smile" /></p>
            <div>
                <a href="https://github.com/kongs510/youtubeClone">github Link</a>
            </div>
        </div >
    )
}

export default Footer
