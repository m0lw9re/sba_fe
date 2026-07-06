import { Button, Modal, Row, Space } from "antd";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import {
  ApprovalHistoryType,
  ApprovalStaffType,
} from "constant/types/appraisalFile";
import ApprovalHistoryTable from "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal/ApprovalHistoryTable";
import "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal/style.scss";
import React from "react";
import { formatDateWithHour } from "utils";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  staffs: ApprovalStaffType[];
  historyApproval: ApprovalHistoryType[];
  assetLevelTwoId: number;
  signatureDate: string | null;
};

const ApprovalHistoryModal: React.FC<Props> = ({
  closeModal,
  isOpen,
  staffs,
  historyApproval,
  assetLevelTwoId,
  signatureDate,
}) => {
  return (
    <Modal
      open={isOpen}
      closable={false}
      footer={null}
      onCancel={closeModal}
      className="modalApprovalHistory"
      style={{ display: "flex", justifyContent: "center", width: "100%" }}
    >
      <Space direction="vertical" size={"small"} className="space-assignment">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="modalApprovalHistory-header"
          style={{ width: "100%" }}
        >
          <CardTitleCustomUpdate title="Lịch sử phê duyệt" />
          <Button
            size="small"
            shape="circle"
            icon={<Icons.close />}
            onClick={closeModal}
          />
        </Row>
      </Space>
      <div className="table-addition" style={{ padding: "0.5rem 0.5rem" }}>
        <ApprovalHistoryTable
          assetLevelTwoId={assetLevelTwoId}
          staffs={staffs}
          historyApproval={historyApproval}
        />
        <Row
          justify={"space-between"}
          style={{ padding: "0", paddingTop: "0.5rem" }}
          className="button-row"
        >
          {signatureDate && (
            <div style={{ padding: "0.25rem 0 0 0" }}>
              <b>Thời điểm ký số:</b> {formatDateWithHour(signatureDate)}
            </div>
          )}
          <Space>
            <ButtonCustom
              label="Đóng"
              onClick={() => {
                closeModal();
              }}
            />
          </Space>
        </Row>
      </div>
    </Modal>
  );
};

export default ApprovalHistoryModal;
