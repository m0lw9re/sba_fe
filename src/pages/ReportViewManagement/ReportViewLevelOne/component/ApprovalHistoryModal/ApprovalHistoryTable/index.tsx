import { Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { APPROVAL_STATUS_LABEL } from "constant/common";
import { ApprovalHistoryType } from "constant/types";
import { ApprovalStaffType } from "constant/types/appraisalFile";
import "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal/ApprovalHistoryTable/style.scss";
import { useState } from "react";
import { formatDateWithHour } from "utils";
import { ResultDetailByApartment } from "./ResultTablesByAssetType/ResultApartment";
import { ResultDetail } from "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal/ApprovalHistoryTable/ResultTablesByAssetType/ResultLand";
import { ResultDetailByMachineDevice } from "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal/ApprovalHistoryTable/ResultTablesByAssetType/ResultMachineDevice";
import { ResultDetailByRoadVehicle } from "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal/ApprovalHistoryTable/ResultTablesByAssetType/ResultRoadVehicle";
import { ResultDetailByWaterVehicle } from "pages/ReportViewManagement/ReportViewLevelOne/component/ApprovalHistoryModal/ApprovalHistoryTable/ResultTablesByAssetType/ResultWaterVehicle";
import { ASSET_LV2 } from "constant/enums";

type Props = {
  staffs: ApprovalStaffType[];
  historyApproval: ApprovalHistoryType[];
  assetLevelTwoId: number;
};

const ApprovalHistoryTable = ({
  staffs,
  historyApproval,
  assetLevelTwoId,
}: Props) => {
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedHistoryIndex, SelectedHistoryIndex] = useState<number>(0);
  const columns: ColumnsType<ApprovalHistoryType> = [
    {
      key: 1,
      title: "STT",
      width: "3%",
      align: "center",
      dataIndex: "key",
      render: (value: number, record: any, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      key: 2,
      title: "Thời gian",
      dataIndex: "createdDate",
      align: "center",
      render: (value) => {
        return <span>{value ? formatDateWithHour(value) : null}</span>;
      },
    },
    {
      key: 3,
      title: "Tên người phê duyệt gần nhất",
      dataIndex: "approvalEmployeeId",
      render: (value) => {
        const staff = staffs.find((item) => item.staffId === value);
        if (!staff) return <></>;
        return (
          <>
            <span style={{ fontWeight: "bold" }}>{staff?.staffName}</span>{" "}
            <span>({staff?.username})</span>
          </>
        );
      },
    },
    {
      key: 4,
      title: "Tên người phê duyệt tiếp theo",
      dataIndex: "approvalNextEmployeeId",
      render: (value) => {
        const staff = staffs.find((item) => item.staffId === value);
        if (!staff) return <></>;
        return (
          <>
            <span style={{ fontWeight: "bold" }}>{staff?.staffName}</span>{" "}
            <span>({staff?.username})</span>
          </>
        );
      },
    },
    {
      key: 5,
      title: "Trạng thái phê duyệt",
      dataIndex: "status",
      render: (value: number) => {
        return <span>{APPROVAL_STATUS_LABEL[value]}</span>;
      },
    },
    {
      key: 6,
      title: "Số cấp đã duyệt",
      dataIndex: "level",
      align: "center",
      render(value: string, record: ApprovalHistoryType) {
        return <span>{record.level + "/" + record.totalLevel}</span>;
      },
    },
    {
      key: 7,
      title: "Nội dung ý kiến",
      dataIndex: "approvalComment",
    },
    {
      key: 7,
      title: "Chi tiết",
      dataIndex: "approvalHistoryId",
      render: (_, record, index: number) => {
        return (
          <span
            style={{
              color: "#1890ff",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              setOpenDetailModal(true);
              SelectedHistoryIndex(index);
            }}
          >
            Xem chi tiết
          </span>
        );
      },
    },
  ];
  const handleCalculateTotalValue = (
    approvalHistoryValue: ApprovalHistoryType
  ) => {
    if (!approvalHistoryValue) return 0;
    const totalHistoryValues =
      approvalHistoryValue.approvalHistoryValueDtos.reduce((arr, curr) => {
        return arr + (curr.totalValue || 0);
      }, 0);
    const totalConstructionValues =
      approvalHistoryValue.approvalHistoryConstructionDtos.reduce(
        (arr, curr) => {
          return arr + (curr.totalValue || 0);
        },
        0
      );

    const result =
      totalHistoryValues +
      totalConstructionValues +
      (approvalHistoryValue?.constructionFutureValue || 0);
    return result;
  };
  const renderResultTables = () => {
    // còn thiếu 5 và 7
    const totalValue = handleCalculateTotalValue(
      historyApproval[selectedHistoryIndex]
    );
    if (
      assetLevelTwoId === ASSET_LV2.LAND ||
      assetLevelTwoId === ASSET_LV2.PROJECT ||
      assetLevelTwoId === ASSET_LV2.ESTIMATE
    ) {
      return (
        <ResultDetail
          approvalHistoryValues={
            historyApproval[selectedHistoryIndex]?.approvalHistoryValueDtos
          }
          approvalHistoryConstructionDtos={
            historyApproval[selectedHistoryIndex]
              ?.approvalHistoryConstructionDtos
          }
          constructionFutureValue={
            historyApproval[selectedHistoryIndex]?.constructionFutureValue
          }
          assetLevelTwoId={assetLevelTwoId}
          totalValue={totalValue}
        />
      );
    } else if (assetLevelTwoId === ASSET_LV2.APARTMENT) {
      return (
        <ResultDetailByApartment
          approvalHistoryValues={
            historyApproval[selectedHistoryIndex]?.approvalHistoryValueDtos
          }
          totalValue={totalValue}
        />
      );
    } else if (assetLevelTwoId === ASSET_LV2.VEHICLE) {
      return (
        <ResultDetailByRoadVehicle
          approvalHistoryValues={
            historyApproval[selectedHistoryIndex]?.approvalHistoryValueDtos
          }
          totalValue={totalValue}
        />
      );
    } else if (assetLevelTwoId === ASSET_LV2.WATER_VEHICLE) {
      return (
        <ResultDetailByWaterVehicle
          approvalHistoryValues={
            historyApproval[selectedHistoryIndex]?.approvalHistoryValueDtos
          }
          totalValue={totalValue}
        />
      );
    } else if (assetLevelTwoId === ASSET_LV2.MACHINE) {
      return (
        <ResultDetailByMachineDevice
          approvalHistoryValues={
            historyApproval[selectedHistoryIndex]?.approvalHistoryValueDtos
          }
          totalValue={totalValue}
        />
      );
    } else {
      return <></>;
    }
  };
  return (
    <div className="approval-history-table-container">
      <Table
        columns={columns}
        dataSource={historyApproval || []}
        bordered={true}
        size="small"
        pagination={false}
      />
      <Modal
        title="Kết quả chi tiết"
        visible={openDetailModal}
        width={1300}
        onCancel={() => setOpenDetailModal(false)}
        footer={null}
      >
        {{ ...renderResultTables() }}
      </Modal>
    </div>
  );
};

export default ApprovalHistoryTable;
