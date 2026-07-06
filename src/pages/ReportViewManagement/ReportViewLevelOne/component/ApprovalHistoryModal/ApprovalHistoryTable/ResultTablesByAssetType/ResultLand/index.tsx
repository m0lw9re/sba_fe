import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import { FC } from "react";

import {
  ApprovalHistoryConstructionDtos,
  ApprovalHistoryValues,
} from "constant/types/appraisalFile";
import "../style.scss";
import TitleCustom from "components/TitleCustom";
import InputFields from "components/InputFields";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { numberUtils } from "utils";
import { sortBy } from "lodash";

const { INPUT_NUMBER, INPUT } = TYPE_FIELD;

type Props = {
  approvalHistoryValues: ApprovalHistoryValues[];
  approvalHistoryConstructionDtos: ApprovalHistoryConstructionDtos[];
  constructionFutureValue: number | null;
  assetLevelTwoId: number;
  totalValue: number;
};

export const ResultDetail: FC<Props> = (props) => {
  const {
    approvalHistoryValues,
    approvalHistoryConstructionDtos,
    constructionFutureValue,
    assetLevelTwoId,
    totalValue,
  } = props;

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
      render: (name) => <FormItem type={INPUT} value={name} disable />,
    },
    {
      key: 3,
      title: "Phân loại",
      dataIndex: "type",
      width: "10%",
      render: (type) => {
        if (type === 1) return "PHQH";
        else if (type === 2) return "KPHQH";
        else return "";
      },
    },
    {
      key: 4,
      title: "Diện tích (m²)",
      dataIndex: "totalArea",
      width: "15%",
      render: (totalArea) => (
        <FormItem
          type={INPUT_NUMBER}
          value={totalArea}
          align={"right"}
          disable
          currencable
        />
      ),
    },
    {
      key: 7,
      title: "Đơn giá (đồng/m²)",
      dataIndex: "unitPrice",
      width: "15%",
      render: (unitPrice) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={unitPrice}
          align={"right"}
          disable
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
          value={totalValue}
          align={"right"}
          disable
        />
      ),
    },
  ];

  const columnsCTXD: ColumnsType<ApprovalHistoryConstructionDtos> = [
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
      title: "Loại công trình xây dựng",
      width: "20%",
      render: (_, record) => (
        <FormItem type={INPUT} disable value={record.constructionTypeName} />
      ),
    },
    {
      key: 3,
      title: "Mô tả đặc tính kỹ thuật",
      width: "27%",
      render: (_, record) => (
        <FormItem type={INPUT} disable value={record.constructionName} />
      ),
    },
    {
      key: 5,
      title: "CLCL %",
      dataIndex: "remainingQuality",
      width: "8%",
      render: (remainingQuality) => (
        <FormItem
          type={INPUT_NUMBER}
          percentable
          value={remainingQuality}
          align={"right"}
          disable
        />
      ),
    },
    {
      key: 6,
      title: "Mức độ HT %",
      dataIndex: "mdht",
      width: "8%",
      render: (mdht) => (
        <FormItem
          type={INPUT_NUMBER}
          value={mdht}
          percentable
          align={"right"}
          disable
        />
      ),
    },
    {
      key: 4,
      title: "Diện tích (m²)",
      dataIndex: "constructionArea",
      width: "8%",
      render: (constructionArea) => (
        <FormItem
          type={INPUT_NUMBER}
          value={constructionArea}
          align={"right"}
          disable
          currencable
        />
      ),
    },
    {
      key: 7,
      title: "Đơn giá (đồng/m²)",
      dataIndex: "unitPrice",
      width: "12%",
      render: (unitPrice) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={unitPrice}
          align={"right"}
          disable
        />
      ),
    },
    {
      key: 8,
      title: "Giá trị (đồng)",
      dataIndex: "totalValue",
      width: "12%",
      render: (totalValue) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={totalValue}
          align={"right"}
          disable
        />
      ),
    },
  ];
  const inputs: InputFiledParams[] = [
    {
      key: 1,
      type: INPUT_NUMBER,
      label: "Tổng giá trị CTXD hình thành trong tương lai - tham khảo (đồng)",
      value: constructionFutureValue || "",
      span: 20,
      labelCol: { span: 12 },
      wrapperCol: { span: 8 },
      currencable: true,
      isRounded: true,
      disable: true,
    },
  ];
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Table
        className="table-result-wrapper"
        size="small"
        bordered
        columns={columns}
        dataSource={sortBy(approvalHistoryValues, ["orderBy"]) || []}
        pagination={false}
        title={() => (
          <h4 style={{ fontWeight: "600", margin: 0 }}>
            Kết quả chi tiết giá đất
          </h4>
        )}
      />
      <Table
        className="table-result-wrapper"
        size="small"
        bordered
        columns={columnsCTXD}
        dataSource={
          approvalHistoryConstructionDtos?.sort(
            (a, b) => (a?.constructionId || 0) - (b?.constructionId || 0)
          ) || []
        }
        pagination={false}
        title={() => (
          <h4 style={{ fontWeight: "600", margin: 0 }}>
            Kết quả chi tiết giá CTXD
          </h4>
        )}
      />
      {assetLevelTwoId === 9 && (
        <Space
          direction="vertical"
          size={"middle"}
          style={{ marginTop: "12px", width: "100%" }}
        >
          <TitleCustom
            size="small"
            textAlign="center"
            title="Kết quả chi tiết giá trị CTXD hình thành trong tương lai"
          ></TitleCustom>
          <InputFields data={inputs} />
        </Space>
      )}
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
