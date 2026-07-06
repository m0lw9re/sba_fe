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
  totalValue: number;
  setUpdateFormValue: any;
};

export const ResultByMachineDevice: FC<Props> = (props) => {

  const { totalValue, updateFormValue, setUpdateFormValue } = props;
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
      title: "Tài sản",
      dataIndex: "name",
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
      title: "Đơn giá (đồng)",
      dataIndex: "unitPrice",
      width: "15%",
      render: (unitPrice, record, index) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={unitPrice}
          onChange={(value: number) =>
            handleValueRowChange(
              record.realCommonMachine
                ? {
                    unitPrice: value,
                    totalValue: value * record.realCommonMachine,
                  }
                : { unitPrice: value },
              index
            )
          }
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
          currencable
          isRounded
          disable
          value={totalValue}
          onChange={(value: number) =>
            handleValueRowChange({ totalValue: value }, index)
          }
        />
      ),
    },
  ];
  const handleValueRowChange = (data: any, index: number) => {
    const newApprovalHistoryValues = [...approvalHistoryValues];
    newApprovalHistoryValues[index] = {
      ...newApprovalHistoryValues[index],
      ...data,
    };
    setUpdateFormValue({
      ...updateFormValue,
      approvalHistoryValues: newApprovalHistoryValues,
    });
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <TitleCustom title="Kết quả chi tiết" size="middle" />
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
    </Space>
  );
};
