import { PlusOutlined } from "@ant-design/icons";
import { Form, Tooltip, Upload, UploadFile, UploadProps } from "antd";
import { RcFile } from "antd/es/upload";
import React, { useCallback, useEffect, useState } from "react";
import { FormImage } from "./component/FormImage";
import './style.scss'

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
type Props = {
    label: string;
}
export const ImageSignatureUpdate: React.FC<Props> = ({label}) => {
    const [showWallImg, setShowWallImg] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uidRemoved, setUidRemoved] = useState<string>('');
    const handleCustomStatusUpload = (options: any) => {
        if (options.onSuccess()) {
            options.onSuccess()
        }
        return 1;
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }
        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined style={{color: '#2862AF' }}/>
            <div style={{ marginTop: 8, color: '#2862AF' }}>Upload chữ ký</div>
        </div>
    );
    const props: UploadProps = {
        name: 'file',
        onChange(info) {
            setShowWallImg(true)
            setFileList([info.file])
        },
    };


    const onRefreshFileList = useCallback((uid: string) => {
        let newListFile = fileList.filter((item: UploadFile) => item.uid !== uid)
        setFileList(newListFile)
    }, [fileList])

    const handleRemoved = (uid: string) => {
        setUidRemoved(uid)
    }

    useEffect(() => {
        if (uidRemoved?.trim()?.length > 0) {
            onRefreshFileList(uidRemoved)
        }
    }, [uidRemoved])
    return (
        <Form
            labelAlign="left"
            labelWrap
            size="small"
            layout="vertical"
        >
            <Form.Item
                label={
                    <Tooltip placement="bottom" title={label}>
                        {label}
                        <span style={{ color: "#F25B60" }}> *</span>
                    </Tooltip>
                }
            >
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleChange}
                    itemRender={(originNode, file) => <FormImage file={file} onPreview={handlePreview} onRemoved={handleRemoved} setFile={setFileList} />}
                    customRequest={handleCustomStatusUpload}
                    className="diagram-form-upload-signature"
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

        </Form>

    )
}