import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Upload, UploadFile, UploadProps } from "antd";
import { useState } from "react";
import './style.scss';

const UpLoadCell = () => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const onChangeImage: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };
    const handleCustomStatusUpload = (options: any) => {
        if (options.onSuccess()) {
            options.onSuccess()
        }
        return 1;
    }

    return (
        <Form.Item className={'cell-upload'}>
            {fileList.length <= 0 ? (
                <Upload
                    className="cell-upload-item"
                    fileList={fileList}
                    onChange={onChangeImage}
                    customRequest={handleCustomStatusUpload}
                >
                    <Button className="cell-upload-button" type="text" size="small">Upload ảnh <UploadOutlined /></Button>
                </Upload>)
                : (<Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChangeImage}
                    className="cell-upload-item"
                    customRequest={handleCustomStatusUpload}
                >
                    {fileList.length < 5 && '+ Upload'}
                </Upload>
                )}

        </Form.Item>
    )
}


export default UpLoadCell;