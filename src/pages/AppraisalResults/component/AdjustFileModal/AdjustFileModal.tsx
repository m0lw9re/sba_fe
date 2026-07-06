import {
  Button,
  Col,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import renderRequired from "components/RenderRequire";
import { useFormik } from "formik";
import { useState } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  onOk: () => void;
};

type FormType = {
  note: string;
};

const AdjustFileModal: React.FC<Props> = ({ closeModal, isOpen, onOk }) => {
  const { id } = useParams<{ id: string }>();
  const [confirmPopup, setConfirmPopup] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");

  const handleAdjustFile = async () => {
    try {
      //call api tại đây
    } catch (error) {
      console.log(error);
    }
  };

  const handleOk = () => {
    if (note) {
      handleAdjustFile();
      setConfirmPopup(false);
      onOk();
    }
  };

  return (
    <Modal
      closeIcon={null}
      open={isOpen}
      onCancel={closeModal}
      footer={null}
      destroyOnClose={false}
      forceRender={true}
      className="approvel-history-modal"
      width={500}
    >
      <Space
        direction="vertical"
        style={{ width: "100%" }}
        className="space-assignment"
      >
        <Row
          justify={"space-between"}
          className="modal-header approvel-history-modal-header"
          align={"middle"}
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Lý do điều chỉnh" />
          <Button
            size="small"
            shape="circle"
            icon={<Icons.close />}
            onClick={closeModal}
          />
        </Row>
        <Row
          style={{ display: "flex", flexDirection: "column", padding: "0 8px" }}
        >
          <Typography.Title level={5} style={{ marginTop: 5 }}>
            {renderRequired("Lý do điều chỉnh")}
          </Typography.Title>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input.TextArea
                size={"small"}
                maxLength={1000}
                style={{ height: 120, marginBottom: 24 }}
                onChange={(e) => setNote(e.target.value)}
                value={note}
                placeholder="Nhập"
                allowClear
              />
            </Col>
          </Row>
        </Row>
        <Row
          justify={"end"}
          className="padding-content"
          style={{ padding: "0 8px", paddingBottom: "17px", marginTop: "8px" }}
        >
          <Space>
            <ButtonCustom label="Hủy bỏ" onClick={closeModal} />
            <Popconfirm
              title="Xác nhận"
              description={`Bạn có chắc chắn muốn chuyển đổi người ký số hồ sơ này?`}
              placement="bottomLeft"
              okText="Đồng ý"
              cancelText="Hủy"
              open={confirmPopup}
              onConfirm={handleOk}
              onCancel={() => setConfirmPopup(false)}
            >
              <ButtonCustom
                label={"Xác nhận"}
                bgColor="#2862AF"
                type="primary"
                onClick={() => {
                  if (!note) {
                    message.error("Vui lòng nhập lý do điều chỉnh");
                    return;
                  }
                  setConfirmPopup(true);
                }}
              />
            </Popconfirm>
          </Space>
        </Row>
      </Space>
    </Modal>
  );
};

export default AdjustFileModal;
