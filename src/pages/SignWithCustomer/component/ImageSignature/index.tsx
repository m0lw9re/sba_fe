import { DeleteOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Modal, Space, Tooltip, Upload, message } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import {
  SignaturesContext,
  SignaturesContextProps,
  SignaturesProps,
} from "pages/SignWithCustomer";
import React, { useContext, useEffect, useState } from "react";
import { getBase64 } from "utils";
import "./style.scss";

type Props = {
  label: string;
  type: "employee" | "instructor";
};

const ImageSignature: React.FC<Props> = ({ label, type }) => {
  const signaturesContext = useContext(
    SignaturesContext
  ) as SignaturesContextProps;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSaveSignature = async (file: UploadFile) => {
    const signaturesData = JSON.parse(
      localStorage.getItem("signatures") || "[]"
      ) as SignaturesProps[];
    const findIndex = signaturesData.findIndex(
      (item) =>
        item.appraisalFileId === signaturesContext.signatures.appraisalFileId
    );
    const base64 = await getBase64(file.originFileObj as RcFile);

    if (findIndex !== -1) {
      signaturesData[findIndex] = {
        ...signaturesData[findIndex],
        [type]: base64,
      };
    } else {
      signaturesData.push({
        ...signaturesContext.signatures,
        [type]: base64,
      });
    }
    try {
      localStorage.setItem("signatures", JSON.stringify(signaturesData));
    } catch (error) {
      // delete other signatures
      const clearedSignatures = signaturesData.filter((item) =>
        item.appraisalFileId !== signaturesContext.signatures.appraisalFileId
      );
      localStorage.setItem("signatures", JSON.stringify(clearedSignatures));
    }
  };
  const handleDeleteSignature = () => {
    const signaturesData = JSON.parse(
      localStorage.getItem("signatures") || "[]"
    ) as SignaturesProps[];
    const findIndex = signaturesData.findIndex(
      (item) =>
        item.appraisalFileId === signaturesContext.signatures.appraisalFileId
    );
    if (findIndex !== -1) {
      signaturesData[findIndex] = {
        ...signaturesData[findIndex],
        [type]: "",
      };
    }
    localStorage.setItem("signatures", JSON.stringify(signaturesData));
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      type === "instructor"
        ? "Chữ ký Người hướng dẫn/Đại diện chủ sở hữu"
        : "Chữ ký Nhân viên/Chuyên viên thẩm định giá"
    );
  };
  const handleRemoved = (file: UploadFile) => {
    let newListFile = fileList.filter(
      (item: UploadFile) => item.uid !== file.uid
    );
    setFileList(newListFile);
    handleDeleteSignature();
    signaturesContext.handleChangeSignature(type, null);
  };
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    const file = newFileList[0];
    if (file?.size && file?.size > (1024 * 1024) / 2) {
      message.error("Kích thước ảnh không được vượt quá 500KB");
      return;
    }
    setFileList(newFileList);
    if (newFileList.length > 0) {
      handleSaveSignature(newFileList[0]);
      signaturesContext.handleChangeSignature(
        type,
        newFileList[0].originFileObj as RcFile
      );
    }
  };

  useEffect(() => {
    if (signaturesContext.signatures) {
      const url = signaturesContext.signatures[type];
      if (url) {
        setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url,
          },
        ]);
      }
    }
  }, [signaturesContext.signatures]);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Space
      direction="vertical"
      style={{ width: "100%" }}
      size={"small"}
      className="signature-wrapper"
    >
      <Form labelAlign="left" labelWrap size="small" layout="vertical">
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
            beforeUpload={() => false}
            onPreview={handlePreview}
            accept=".png, .jpg, .jpeg"
            onChange={handleChange}
            onRemove={handleRemoved}
            style={{ width: "100%" }}
            className="signature-upload"
            showUploadList={{
              removeIcon: (
                <DeleteOutlined
                  size={24}
                  style={{
                    fontSize: "20px !important",
                  }}
                />
              ),
              previewIcon: (
                <EyeOutlined
                  size={24}
                  style={{
                    fontSize: "20px !important",
                  }}
                />
              ),
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
      </Form>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Space>
  );
};

export default ImageSignature;
