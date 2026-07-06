import React, { useState } from "react";
import { Modal, Row, Button, Space, Typography, Image } from "antd";
import "./style.scss";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CloseOutlined } from "@ant-design/icons";
import caution from "assets/images/png/caution.png";

type Props = {
  isOpenModal: boolean;
  closeModal: () => void;
  handleConfirm: () => void;
};

const ModalChangeAsset: React.FC<Props> = ({
  isOpenModal,
  closeModal,
  handleConfirm,
}) => {
  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);

  const onConfirm = async () => {
    handleConfirm();
    closeModal();
  };

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modal-changeAsset"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modal-changeAsset-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Cảnh báo" />
          <Button
            shape="circle"
            icon={<CloseOutlined />}
            onClick={closeModal}
            size="small"
          />
        </Row>
        <div style={{ textAlign: "center" }}>
          <div className="warning" style={{width: "100%"}}>
            <Image
              preview={false}
              src={caution}
              style={{ textAlign: "center" }}
              width={80}
              height={80}
            />
          </div>
          <Typography.Text className="main-content">
            Bạn có xác nhận thay đổi loại tài sản cấp 3 này không? <br/> Nếu bạn thay
            đổi các trường dữ liệu đã nhập sẽ biến mất.
          </Typography.Text>
        </div>
        <Row
          justify={"end"}
          style={{ padding: "0 16px", paddingBottom: "16px" }}
          align={"middle"}
        >
          <Space>
            <ButtonCustom label="Hủy bỏ" size="middle" onClick={closeModal} />
            <ButtonCustom
              onClick={onConfirm}
              type="primary"
              size="middle"
              bgColor="rgba(40, 98, 175, 1)"
              loading={isLoadingBtn}
              label="Xác nhận"
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default ModalChangeAsset;
