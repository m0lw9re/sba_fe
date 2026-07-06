import { Button, Modal, Popconfirm, Row, Space, message } from "antd";
import { sendApprovalAPI } from "apis/sendApproval";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import SelectCustom from "components/SelectCustom";
import "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal/style.scss";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isLiveEnv } from "utils/common";
import { useAccounts } from "utils/request";
import { useStaffCanSign } from "utils/request/useStaffs";

type Props = {
  isOpen: boolean;
  totalAssetValue: number;
  companyBranchId: number;
  closeModal: () => void;
  onOk: () => void;
  selectedStaff: any;
  setSelectedStaff: (value: any) => void;
};

const AdjustSignerModal: React.FC<Props> = ({
  closeModal,
  isOpen,
  totalAssetValue,
  companyBranchId,
  onOk,
  setSelectedStaff,
  selectedStaff,
}) => {
  const { id } = useParams<{ id: string }>();
  const [confirmPopup, setConfirmPopup] = useState<boolean>(false);

  const handleChangeAdjustSigner = async () => {
    try {
      if (id) {
        const res = await sendApprovalAPI.adjustSigner({
          appraisalFileId: id,
          staffId: selectedStaff,
        });
        console.log("res:", res);
        message.success("Chuyển đổi người ký số thành công");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleOk = () => {
    if (selectedStaff) {
      handleChangeAdjustSigner();
      setConfirmPopup(false);
      onOk();
    }
  };

  const { data: canSignStaffs } = useStaffCanSign({
    companyBranchId,
    totalPrice: totalAssetValue,
  });

  // const { data: allStaffs } = useAccounts({
  //   page: 1,
  //   limit: 9000,
  // });
  const staffs = canSignStaffs;

  useEffect(() => {
    if (staffs && !staffs?.data) {
      message.error("Lấy danh sách người điều chuyển ký số thất bại.");
    }
  }, [staffs]);
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
          <CardTitleCustomUpdate title="Chuyển đổi người ký số" />
          <Button
            size="small"
            shape="circle"
            icon={<Icons.close />}
            onClick={closeModal}
          />
        </Row>
        <Row
          className="padding-content"
          justify={"space-between"}
          style={{ padding: "0 8px" }}
        >
          <SelectCustom
            options={
              staffs?.data?.map((item: any) => ({
                label: `${item.staffName} (${item.username})`,
                value: item.staffId,
              })) || []
            }
            style={{ width: "80%" }}
            onChange={(value) => setSelectedStaff(value)}
            value={selectedStaff}
            placeholder={"Chọn người chuyển đổi ký số"}
            showSearch
          ></SelectCustom>
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
                  if (!selectedStaff) {
                    message.error("Vui lòng chọn người muốn chuyển đổi ký số");
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

export default AdjustSignerModal;
