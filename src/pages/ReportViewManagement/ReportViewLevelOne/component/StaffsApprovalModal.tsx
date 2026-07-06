import React, { useState } from "react";
import { Button, Modal, Popconfirm, Row, Space, message } from "antd";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import SelectCustom from "components/SelectCustom";
import "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal/style.scss";
import { sendApprovalAPI } from "apis/sendApproval";
import { useParams } from "react-router-dom";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  onOk: () => void;
  setSelectedStaff: (value: any) => void;
  setStaffsApproval: (value: any) => void;
  staffsApproval: any[];
  selectedStaff: any;
  isSendApproval: boolean;
};

const StaffsApprovalModal: React.FC<Props> = ({
  closeModal,
  isOpen,
  isSendApproval,
  onOk,
  staffsApproval,
  setSelectedStaff,
  selectedStaff,
  setStaffsApproval,
}) => {
  const { id } = useParams<{ id: string }>();
  const [confirmPopup, setConfirmPopup] = useState<boolean>(false);
  const handleOk = () => {
    if (selectedStaff) {
      onOk();
      setConfirmPopup(false);
    }
  };
  const fetchApprovalStaffs = async () => {
    try {
      const res = await sendApprovalAPI.getApprovalStaff(id!);
      if (res.data.code === 200) {
        message.success(res.data.message);
        setStaffsApproval(res.data.data || []);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  const handleCloseModal = () => {
    closeModal();
    setConfirmPopup(false);
  }

  return (
    <Modal
      closeIcon={null}
      open={isOpen}
      onCancel={handleCloseModal}
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
          <CardTitleCustomUpdate title="Trình cấp phê duyệt" />
          <Button
            size="small"
            shape="circle"
            icon={<Icons.close />}
            onClick={handleCloseModal}
          />
        </Row>
        <Row
          className="padding-content"
          justify={"space-between"}
          style={{ padding: "0 8px" }}
        >
          <SelectCustom
            options={staffsApproval.map((item) => ({
              label: `${item.staffName} (${item.username})`,
              value: item.staffId,
            }))}
            showSearch
            style={{ width: "80%" }}
            onChange={(value) => setSelectedStaff(value)}
            value={selectedStaff}
            placeholder={"Chọn người phê duyệt"}
          ></SelectCustom>
          <Button
            type="primary"
            icon={<Icons.reload />}
            ghost
            onClick={fetchApprovalStaffs}
          ></Button>
        </Row>
        <Row
          justify={"end"}
          className="padding-content"
          style={{ padding: "0 8px", paddingBottom: "17px", marginTop: "8px" }}
        >
          <Space>
            <ButtonCustom label="Hủy bỏ" onClick={handleCloseModal} />
            <Popconfirm
              title="Xác nhận"
              description={`Bạn có chắc chắn muốn ${
                isSendApproval ? "Gửi duyệt" : "Phê duyệt"
              } hồ sơ này?`}
              placement="bottomLeft"
              okText="Đồng ý"
              cancelText="Hủy"
              open={confirmPopup}
              onConfirm={handleOk}
              onCancel={() => setConfirmPopup(false)}
            >
              <ButtonCustom
                label={isSendApproval ? "Gửi duyệt" : "Phê duyệt"}
                bgColor="#2862AF"
                type="primary"
                onClick={() => {
                  if (!selectedStaff) {
                    message.error("Vui lòng chọn người phê duyệt");
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

export default StaffsApprovalModal;
