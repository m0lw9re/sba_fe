import { Button, Image, Upload, UploadFile, UploadProps } from "antd";
import "./style.scss";
import Icons from "assets/icons";
import { TrashWhiteSVG } from "assets";
import { useState } from "react";
interface ImageItemCustomProps {
  src: string;
  onPreview: () => void;
  onRemoved: () => void;
  setList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}
export const ImageItemCustom = ({
  src,
  onPreview,
  onRemoved,
  setList
}: ImageItemCustomProps) => {
  const [showFill, setShowFill] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setList(newFileList);
  return (
    <div
      className="image-container"
      onMouseOver={() => setShowFill(true)}
      onMouseLeave={() => setShowFill(false)}
    >
      <Image
        src={src}
        preview={false}
        alt="image-upload"
        className="image-contain-upload"
      />
      {showFill && (
        <div
          className={`modal-confirm-action ${!showFill && "hide-fill-control"}`}
        >
          <div className="action-control">
            {/* <Button className="buton-action-image" onClick={onPreview}>
              <Icons.eyeOutlined style={{ fontSize: "20px", color: "white" }} />
            </Button> */}
            <Button className="buton-action-image" onClick={onRemoved}>
              <TrashWhiteSVG style={{ marginTop: "2px" }} /> Xóa ảnh
            </Button>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                showUploadList={false}
                className="resign-item"
              >
                <Button className="buton-action-image" icon={<Icons.edit style={{ color: "white" }}/>}>Ký lại</Button>
              </Upload>
          </div>
        </div>
      )}
    </div>
  );
};
