import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import TitleCustom from "components/TitleCustom";
import { TYPE_FIELD } from "constant/enums";
import { ApprovalHistoryValues } from "constant/types/appraisalFile";
import { FC } from "react";
import { UpdateInfoProps } from "../../..";
import "../style.scss";
import { numberUtils } from "utils";

const { INPUT_NUMBER, INPUT } = TYPE_FIELD;

type Props = {
  updateFormValue: UpdateInfoProps;
  setUpdateFormValue: any;
  totalValue: number;
};

export const ResultByApartment: FC<Props> = (props) => {
  const { updateFormValue, setUpdateFormValue, totalValue } = props;
  const { approvalHistoryValues } = updateFormValue;

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
        <FormItem
          type={INPUT}
          value={name}
          onChange={(e: any) =>
            handleValueRowChange({ name: e.target.value }, index)
          }
          disable
        />
      ),
    },
    {
      key: 4,
      title: "Diện tích sử dụng riêng (m²)",
      dataIndex: "totalArea",
      width: "15%",
      render: (totalArea, _, index) => (
        <FormItem
          type={INPUT_NUMBER}
          value={totalArea}
          currencable
          onChange={(value: number) =>
            handleValueRowChange({ totalArea: value }, index)
          }
        />
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
          currencable
          isRounded
          value={unitPrice}
          onChange={(value: number) =>
            handleValueRowChange({ unitPrice: value }, index)
          }
        />
      ),
    },
    {
      key: 8,
      title: "Giá trị (đồng)",
      dataIndex: "totalValue",
      width: "15%",
      render: (totalValue) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          disable
          value={totalValue}
        />
      ),
    },
  ];
  const handleValueRowChange = (data: any, index: number) => {
    const newApprovalHistoryValues = [...approvalHistoryValues];
    if (!isNaN(data.totalArea) || !isNaN(data.unitPrice)) {
      newApprovalHistoryValues[index] = {
        ...newApprovalHistoryValues[index],
        ...data,
        totalValue: Math.round(
          Number(data.totalArea ?? approvalHistoryValues[index].totalArea) *
            Number(data.unitPrice ?? approvalHistoryValues[index].unitPrice)
        ),
      };
    } else {
      newApprovalHistoryValues[index] = {
        ...newApprovalHistoryValues[index],
        ...data,
      };
    }
    setUpdateFormValue({
      ...updateFormValue,
      approvalHistoryValues: newApprovalHistoryValues,
    });
  };

  return (
    <div>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <TitleCustom title="Kết quả chi tiết giá đất" size="middle" />
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
