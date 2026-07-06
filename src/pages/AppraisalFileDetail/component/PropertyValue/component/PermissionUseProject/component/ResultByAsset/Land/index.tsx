import { sortBy } from "lodash";
import Table, { ColumnsType } from "antd/es/table";
import FormItem from "components/InputFields/FormItem";
import TitleCustom from "components/TitleCustom";
import { TYPE_FIELD } from "constant/enums";
import { TableKQCTXDType, TableKQDatType } from "constant/types/appraisalFile";
import { FC } from "react";
import "../style.scss";
import { numberUtils } from "utils";

const { INPUT_NUMBER } = TYPE_FIELD;

type Props = {
  tableKQDat: Array<TableKQDatType>;
  tableKQCTXD: Array<TableKQCTXDType>;
};

export const ResultLand: FC<Props> = ({ tableKQDat, tableKQCTXD }) => {
  const columns: ColumnsType<TableKQDatType> = [
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
      key: 3,
      title: "Phân loại",
      dataIndex: "type",
      render: (type) => {
        if (type === 1) return "PHQH";
        else if (type === 2) return "KPHQH";
        else return "";
      },
      align: "center",
      width: "15%",
    },
    {
      key: 4,
      title: "Diện tích (m²)",
      dataIndex: "totalAreaApprovaled",
      render: (totalAreaApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
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
          align="right"
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
          align="right"
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
      render: (_, record) =>
        `${record?.constructionType?.constructionTypeName} ${
          record.describe ? "(" + record.describe + ")" : ""
        }`,
      width: "15%",
    },
    {
      key: 2,
      title: "Mô tả đặc tính kỹ thuật",
      render: (_, record) => record?.constructionName?.constructionName,
      width: "24%",
    },
    {
      key: 5,
      title: "CLCL %",
      dataIndex: "remainingQualityApprovaled",
      render: (remainingQualityApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
          value={remainingQualityApprovaled}
          disable={true}
          percentable
        />
      ),
      width: "8%",
    },
    {
      key: 6,
      title: "Mức độ HT %",
      dataIndex: "mdhtApprovaled",
      render: (mdhtApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
          value={mdhtApprovaled}
          disable={true}
          percentable
        />
      ),
      width: "8%",
    },
    {
      key: 4,
      title: "Diện tích (m²)",
      dataIndex: "constructionAreaApprovaled",
      render: (constructionAreaApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
          value={constructionAreaApprovaled}
          disable={true}
          currencable
        />
      ),
      width: "10%",
    },
    {
      key: 7,
      title: "Đơn giá (đồng/m²)",
      dataIndex: "unitPriceApprovaled",
      render: (unitPriceApprovaled) => (
        <FormItem
          type={INPUT_NUMBER}
          align="right"
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
          align="right"
          currencable
          isRounded
          value={totalValueApprovaled}
          disable={true}
        />
      ),
      width: "15%",
    },
  ];

  return (
    <div>
      <Table
        className="table-result-wrapper"
        size="small"
        bordered
        columns={columns}
        dataSource={sortBy(tableKQDat, ["orderBy"]) || []}
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
