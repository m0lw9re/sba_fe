import { Space, UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import { ImageItemCustom } from "components/ImageItemCustom";
import React, { useCallback, useEffect, useState } from "react";
import { getBase64 } from "utils";

type Props = {
  file: UploadFile<any>;
  onPreviewImage: (data: UploadFile) => void;
  handleReloadImage?: () => void;
  onRemoveImage: (uid: string) => void;
  customStyle?: any;
};

const ImageFormContainer: React.FC<Props> = ({
  file,
  onPreviewImage,
  onRemoveImage,
  handleReloadImage,
  customStyle,
}) => {
  const [sourceImage, setSourceImage] = useState<string>("");

  const handleGetImageSource = useCallback(
    async (file: UploadFile) => {
      const source = await getBase64(file.originFileObj as RcFile);
      setSourceImage(source);
    },
    [JSON.stringify(file)]
  );

  const handlePreview = useCallback(() => {
    onPreviewImage(file);
  }, [JSON.stringify(file)]);

  const handleRemoved = () => onRemoveImage(file.uid);

  useEffect(() => {
    if (file?.url) {
      setSourceImage(file.url);
    } else {
      handleGetImageSource(file);
    }
  }, [JSON.stringify(file)]);

  return (
    <Space
      size={"small"}
      direction="vertical"
      style={{ height: "100%", borderRadius: "4px" }}
    >
      <div style={!customStyle ? { height: "314px" } : { ...customStyle }}>
        <ImageItemCustom
          src={sourceImage}
          onPreview={handlePreview}
          onRemoved={handleRemoved}
          handleReloadImage={handleReloadImage}
        />
      </div>
    </Space>
  );
};

export default ImageFormContainer;
