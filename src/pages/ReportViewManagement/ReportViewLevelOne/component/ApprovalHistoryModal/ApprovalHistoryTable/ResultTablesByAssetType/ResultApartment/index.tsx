import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import { ApprovalHistoryValues } from "constant/types/appraisalFile";
import { FC } from "react";
import "../style.scss";
import { numberUtils } from "utils";
import TitleCustom from "components/TitleCustom";

const { INPUT_NUMBER, INPUT } = TYPE_FIELD;

type Props = {
  approvalHistoryValues: ApprovalHistoryValues[];
  totalValue: number;
};

export const ResultDetailByApartment: FC<Props> = (props) => {
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
      title: "Tên tài sản",
      dataIndex: "name",
      width: "40%",
      render: (name, _, index) => (
        <FormItem type={INPUT} value={name} disable />
      ),
    },
    {
      key: 4,
      title: "Diện tích sử dụng riêng (m²)",
      dataIndex: "totalArea",
      width: "15%",
      render: (totalArea, _, index) => (
        <FormItem type={INPUT_NUMBER} value={totalArea} disable currencable />
      ),
    },
    {
      key: 7,
      title: "Đơn giá (đồng/m²)",
      dataIndex: "unitPrice",
      width: "15%",
      render: (unitPrice, _, index) => (
        <FormItem
          type={INPUT_NUMBER}
          isRounded
          currencable
          value={unitPrice}
          disable
        />
      ),
    },
    {
      key: 8,
      title: "Giá trị (đồng)",
      dataIndex: "totalValue",
      width: "15%",
      render: (totalValue, _, index) => (
        <FormItem
          type={INPUT_NUMBER}
          isRounded
          currencable
          value={totalValue}
          disable
        />
      ),
    },
  ];

  return (
    <div>
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
            <h4 style={{ fontWeight: "600", margin: 0 }}>
              Kết quả chi tiết giá đất
            </h4>
          )}
        />
      </Space>
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
    </div>
  );
};
