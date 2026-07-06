import { Form, Modal, UploadFile } from "antd";
import Upload, { RcFile, UploadProps } from "antd/es/upload";
import { useEffect, useState } from "react";
import { getBase64 } from "utils";

import "./style.scss";

type Props = {
  onChange?: any;
  maxCount?: number;
  disabled?: boolean;
  imageList?: Array<any>;
};

const UpLoadCell = ({ onChange, imageList, maxCount = 1, disabled }: Props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (imageList && imageList?.length >= 0) {
      const loadImage = imageList
        .filter(item => item)
        .map((item: any, i) => {
          if (!item?.uid) {
            return {
              ...item,
              uid: item.ecmId,
            } as UploadFile;
          } else {
            return {
              ...item,
              status: "done",
              url: item.url,
            } as UploadFile;
          }
        });
      setFileList(prev => [...loadImage]);
    }
  }, [JSON.stringify(imageList)]);

  const [previewImageTitle, setPreviewImageTitle] = useState<string>("");

  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");

  const [isOpenPreviewImage, setIsOpenPreviewImage] = useState<boolean>(false);

  const handleOpenPreviewImage = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImageUrl(file.url || (file.preview as string));
    setIsOpenPreviewImage(true);
    setPreviewImageTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleClosePreview = () => setIsOpenPreviewImage(false);

  const onChangeImage: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
    onChange(newFileList);
  };

  const propsImage = {
    name: "file",
    action: "#",

    async customRequest(options: any) {
      const { onSuccess } = options;

      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },

    onRemove(e: any) {
      console.log(e);
    },
  };

  return (
    <Form.Item className={"cell-upload"}>
      {fileList.length <= 0 ? (
        <Upload
          multiple
          listType="picture-card"
          className="cell-upload-item"
          accept=".png, .jpg, .jpeg"
          fileList={fileList}
          disabled={disabled}
          onChange={onChangeImage}
          maxCount={maxCount}
          onPreview={handleOpenPreviewImage}
          {...propsImage}
        >
          Upload ảnh
        </Upload>
      ) : (
        <Upload
          multiple
          listType="picture-card"
          accept=".png, .jpg, .jpeg"
          fileList={fileList}
          disabled={disabled}
          onChange={onChangeImage}
          className="cell-upload-item"
          maxCount={maxCount}
          onPreview={handleOpenPreviewImage}
          {...propsImage}
        >
          {fileList.length < 5 && "+ Upload"}
        </Upload>
      )}
      <Modal
        open={isOpenPreviewImage}
        title={previewImageTitle}
        footer={null}
        onCancel={handleClosePreview}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImageUrl} />
      </Modal>
    </Form.Item>
  );
};

export default UpLoadCell;
