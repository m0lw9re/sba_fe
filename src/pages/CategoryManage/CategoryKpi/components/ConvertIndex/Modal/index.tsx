import { CloseOutlined } from "@ant-design/icons";
import { Button, Modal, Row, Space } from "antd";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import React from "react";
import { useAppSelector } from "configs/hooks";
import EditForm from "./form";
import "./style.scss";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mutate?: any;
};

const ModalConverIndex: React.FC<Props> = ({ isOpen, onClose, mutate }) => {
  const record = useAppSelector((state) => state.categoryKpiSlice.record);
  const modalType = useAppSelector((state) => state.categoryKpiSlice.modalType);

  return (
    <>
      <Modal
        open={isOpen}
        closable={false}
        footer={null}
        onCancel={onClose}
        className="modal-convert-index"
        style={{ display: "flex", justifyContent: "center" }}
        title={
          <Space direction="vertical" align="center">
            <Row
              justify={"space-between"}
              align={"middle"}
              className="modal-convert-index-header"
            >
              <CardTitleCustomUpdate
                title={`${
                  modalType === "add" ? "Thêm" : "Sửa"
                } quy đổi hệ số hồ sơ`}
              />
              <Button
                shape="circle"
                icon={<CloseOutlined />}
                onClick={onClose}
                size="small"
              />
            </Row>
            <EditForm
              onClose={onClose}
              modalType={modalType}
              record={record}
              mutate={mutate}
            ></EditForm>
          </Space>
        }
      ></Modal>
    </>
  );
};

export default ModalConverIndex;