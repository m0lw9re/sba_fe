import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import TitleCustom from "components/TitleCustom";
import { TYPE_FIELD } from "constant/enums";
import { ApprovalHistoryValues } from "constant/types/appraisalFile";
import { FC } from "react";
import "../style.scss";
import { numberUtils } from "utils";

const { INPUT_NUMBER, INPUT } = TYPE_FIELD;

type Props = {
  approvalHistoryValues: ApprovalHistoryValues[];
  totalValue: number;
};

export const ResultDetailByMachineDevice: FC<Props> = (props) => {
  const { approvalHistoryValues, totalValue } = props;

  const columns: ColumnsType<ApprovalHistoryValues> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "stt",
      width: "5%",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    {
      key: 2,
      title: "Tài sản",
      dataIndex: "name",
      render: (name, _, index) => (
        <FormItem type={INPUT} disable value={name} />
      ),
    },
    {
      key: 3,
      title: "Số lượng MMTB",
      dataIndex: "realCommonMachine",
      width: "20%",
      render: (realCommonMachine) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
          currencable
          isRounded
          value={realCommonMachine}
          disable={true}
        />
      ),
    },
    {
      key: 4,
      title: "Đơn giá (đồng/m²)",
      dataIndex: "unitPrice",
      width: "15%",
      render: (unitPrice, _, index) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
          currencable
          isRounded
          disable
          value={unitPrice}
        />
      ),
    },
    {
      key: 5,
      title: "Giá trị (đồng)",
      dataIndex: "totalValue",
      width: "15%",
      render: (totalValue, _, index) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
          currencable
          isRounded
          disable
          value={totalValue}
        />
      ),
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Table
        className="table-result-wrapper"
        size="small"
        bordered
        columns={columns}
        dataSource={
          approvalHistoryValues?.sort(
            (a, b) =>
              Number(a?.valuationResultLandEstateId) -
              Number(b?.valuationResultLandEstateId)
          ) || []
        }
        pagination={false}
        title={() => (
          <h4 style={{ fontWeight: "600", margin: 0 }}>Kết quả chi tiết</h4>
        )}
      />
      <Space
        direction="horizontal"
        size="middle"
        style={{ width: "100%", marginTop: "24px" }}
      >
        <TitleCustom title="Tổng giá trị tài sản (đồng):" size="middle" />
        <span style={{ fontWeight: 700, color: "#3d9ffb", fontSize: "17px" }}>
          {numberUtils.formatNumber(totalValue)}
        </span>
      </Space>
    </Space>
  );
};
