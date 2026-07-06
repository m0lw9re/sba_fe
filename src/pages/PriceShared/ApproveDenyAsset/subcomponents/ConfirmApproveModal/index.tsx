import { Button, Modal, Row, Space, Typography } from "antd";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import React, { useState } from "react";
import "pages/PriceShared/ApproveDenyAsset/subcomponents/ConfirmApproveModal/style.scss";
import { log } from "console";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  type: "approve" | "deny";
  handleConfirm: () => void;
};

const ConfirmApproveModal: React.FC<Props> = ({
  closeModal,
  isOpen,
  handleConfirm,
  type,
}) => {
  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);

  const onConfirm = async () => {
    setIsLoadingBtn(true);
    await handleConfirm();
    setIsLoadingBtn(false);
  };

  return (
    <Modal
      closeIcon={null}
      open={isOpen}
      onCancel={closeModal}
      footer={null}
      className="approve-land-using-modal-approve-container"
    >
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Row
          justify={"space-between"}
          className="modal-header"
          align={"middle"}
        >
          <CardTitleCustomUpdate title={type === "approve" ? "Phê duyệt tài sản" : "Từ chối tài sản"}/>
          <Button
            size="small"
            shape="circle"
            icon={<Icons.close />}
            onClick={closeModal}
          />
        </Row>
        <Row style={{ paddingLeft: "8px" }}>
          {type === "approve" ? (
            <Typography className="main-content">
              Bạn có chắc chắn muốn phê duyệt tài sản?
            </Typography>
          ) : (
            <Typography className="main-content">
              Bạn có chắc chắn muốn từ chối tài sản?
            </Typography>
          )}
        </Row>
        <Row
          justify={"end"}
          style={{ padding: "0 16px", paddingBottom: "16px" }}
          align={"middle"}
        >
          <Space>
            <ButtonCustom label="Hủy bỏ" size="middle" onClick={closeModal} />
            <ButtonCustom
              onClick={onConfirm}
              label={type === "approve" ? "Phê duyệt" : "Từ chối"}
              type="primary"
              size="middle"
              bgColor="rgba(40, 98, 175, 1)"
              loading={isLoadingBtn}
            />
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default ConfirmApproveModal;
