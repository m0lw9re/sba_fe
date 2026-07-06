import { Input, Space, UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
import React, { useCallback, useEffect, useState } from "react";
import { getBase64 } from "utils";
import { ImageItemCustom } from "components/ImageItemCustom";

type Props = {
  file: UploadFile<any>;
  onPreviewImage: (data: UploadFile) => void;
  onRemoveImage: (uid: string) => void;
  description: string;
  onChangeDesc: (uid: string, description: string) => void;
  handleReloadImage?: () => void;
};

const ImageFormContainer: React.FC<Props> = ({
  file,
  onPreviewImage,
  onRemoveImage,
  description,
  onChangeDesc,
  handleReloadImage,
}) => {
  const [sourceImage, setSourceImage] = useState<string>("");

  const handleGetImageSource = useCallback(
    async (file: UploadFile) => {
      const source = await getBase64(file.originFileObj as RcFile);
      setSourceImage(source);
    },
    [file]
  );

  const handlePreview = useCallback(() => {
    onPreviewImage(file);
  }, [file]);

  const handleRemoved = () => onRemoveImage(file.uid);

  const handleChangeDesc = (e: any) => {
    onChangeDesc(file.uid, e.target.value);
  };

  useEffect(() => {
    if (file?.url) {
      setSourceImage(file.url);
    } else {
      handleGetImageSource(file);
    }
  }, [file]);

  return (
    <Space
      size={"small"}
      direction="vertical"
      style={{ height: "100%", borderRadius: "4px" }}
    >
      <div style={{ height: "282px" }}>
        <ImageItemCustom
          src={sourceImage}
          onPreview={handlePreview}
          onRemoved={handleRemoved}
          handleReloadImage={handleReloadImage}
        />
      </div>
      <Input
        size="small"
        placeholder="Nhập"
        onChange={handleChangeDesc}
        value={description}
      />
    </Space>
  );
};

export default ImageFormContainer;