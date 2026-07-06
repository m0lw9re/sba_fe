import { FC } from "react";
import {
  TableKQCTXDType,
  TableKQDatProjectType,
  TableTongType,
} from "constant/types/appraisalFile";
import Table, { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import { TYPE_FIELD } from "constant/enums";
import "./style.scss";
import TitleCustom from "components/TitleCustom";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { Space, Typography } from "antd";
import InputFields from "components/InputFields";
import { sortBy } from "lodash";
import { numberUtils } from "utils";

const { INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  tableKQDat: Array<TableKQDatProjectType>;
  tableKQCTXD: Array<TableKQCTXDType>;
  tableTong?: TableTongType;
  assetLevelTwoId?: number;
};

export const Result: FC<Props> = ({
  tableKQDat,
  tableKQCTXD,
  tableTong,
  assetLevelTwoId,
}) => {
  const columns: ColumnsType<TableKQDatProjectType> = [
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
      width: "25%",
    },
    {
      key: 4,
      title: "Diện tích (m²)",
      dataIndex: "totalAreaApprovaled",
      render: (totalAreaApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          value={totalAreaApprovaled}
          disable={true}
          currencable
        />
      ),
      width: "15%",
    },
    {
      key: 7,
      title: "Đơn giá (đồng/m²)",
      dataIndex: "unitPriceApprovaled",
      render: (unitPriceApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={unitPriceApprovaled}
          disable={true}
        />
      ),
      width: "20%",
    },
    {
      key: 8,
      title: "Giá trị (đồng)",
      dataIndex: "totalValueApprovaled",
      render: (totalValueApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={totalValueApprovaled}
          disable={true}
        />
      ),
      width: "20%",
    },
  ];

  const columnsCTXD: ColumnsType<TableKQCTXDType> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "stt",
      width: "5%",
      align: "center",
      render: (_, record, index) => index + 1,
    },
    {
      key: 3,
      title: "Loại công trình xây dựng",
      render: (_, record) => (
        <>
          <div>{record?.constructionType?.constructionTypeName}</div>
          <Typography.Text italic>
            {record.describe ? "(" + record.describe + ")" : ""}
          </Typography.Text>
        </>
      ),
      width: "15%",
      align: "center",
    },
    {
      key: 4,
      title: "Tên công trình xây dựng",
      render: (_, record) => record?.constructionName?.constructionName,
      width: "15%",
      align: "center",
    },
    {
      key: 5,
      title: "CLCL %",
      dataIndex: "remainingQualityApprovaled",
      render: (remainingQualityApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          value={remainingQualityApprovaled}
          disable={true}
          percentable
        />
      ),
      width: "8%",
    },
    {
      key: 6,
      title: "MĐHT %",
      dataIndex: "mdhtApprovaled",
      render: (mdhtApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          value={mdhtApprovaled}
          disable={true}
          percentable
        />
      ),
      width: "8%",
    },
    {
      key: 4,
      title: "Diện tích sử dụng (m²)",
      dataIndex: "constructionArea",
      render: (constructionArea) => (
        <FormItem
          type={INPUT_NUMBER}
          value={constructionArea}
          disable={true}
          currencable
        />
      ),
      width: "10%",
    },
    {
      key: 7,
      title: "Đơn giá(đồng/m2 hoặc đ/m3)",
      dataIndex: "unitPriceApprovaled",
      render: (unitPriceApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={unitPriceApprovaled}
          disable={true}
        />
      ),
      width: "15%",
    },
    {
      key: 8,
      title: "Giá trị (đồng)",
      dataIndex: "totalValueApprovaled",
      render: (totalValueApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          currencable
          isRounded
          value={totalValueApprovaled}
          disable={true}
        />
      ),
      width: "15%",
    },
  ];
  const inputs: InputFiledParams[] = [
    {
      key: 1,
      type: INPUT_NUMBER,
      label: "Tổng giá trị CTXD hình thành trong tương lai - tham khảo (đồng)",
      value: tableTong?.constructionFutureValueApprovaled || "",
      span: 16,
      labelCol: { span: 8 },
      wrapperCol: { span: 8 },
      disable: true,
      currencable: true,
      isRounded: true,
    },
  ];
  return (
    <div>
      <Table
        className="table-result-wrapper"
        size="small"
        bordered
        columns={columns}
        dataSource={sortBy(tableKQDat, ["valuationResultLandEstateId"]) || []}
        pagination={false}
        title={() => (
          <TitleCustom
            textAlign="center"
            size="small"
            title="Kết quả chi tiết giá đất"
          ></TitleCustom>
        )}
      />
      <Table
        style={{ marginTop: "8px" }}
        className="table-result-wrapper"
        size="small"
        bordered
        columns={columnsCTXD}
        dataSource={sortBy(tableKQCTXD, ["assetLandInforId", "orderBy"]) || []}
        pagination={false}
        title={() => (
          <TitleCustom
            textAlign="center"
            size="small"
            title="Kết quả chi tiết giá CTXD"
          ></TitleCustom>
        )}
      />
    </div>
  );
};
