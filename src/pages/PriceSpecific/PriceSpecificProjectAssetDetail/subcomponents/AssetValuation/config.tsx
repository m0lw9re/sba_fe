import { ColumnsType } from "antd/es/table";
import { AssetLandValuationTableType } from "constant/types";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 0,
    title: "STT",
    dataIndex: "key",
    width: "5%",
    align: "center",
    render: (_, record, index) => index + 1,
  },
  {
    key: 1,
    title: "Tên tài sản",
    dataIndex: "name",
    align: "left",
    width: "25%",
  },
  {
    key: 2,
    title: "Diện tích(m²)",
    dataIndex: "totalArea",
    align: "left",
    render: (totalArea) => (
      <>{totalArea ? numberUtils.formatNumber(totalArea) : "-"}</>
    ),
  },
  {
    key: 7,
    title: "Đơn giá(đ/m²)",
    dataIndex: "unitPrice",
    render: (unitPrice) => (
      <>{unitPrice ? numberUtils.formatNumber(unitPrice) : "-"}</>
    ),
    align: "left",
  },
  {
    key: 8,
    title: "Giá trị(đ)",
    dataIndex: "totalValue",
    render: (totalValue) => (
      <>{totalValue ? numberUtils.formatNumber(totalValue) : "-"}</>
    ),
    align: "left",
  },
  // {
  //   key: 9,
  //   title: "Giá trị định giá đề xuất (đồng)",
  //   dataIndex: "proposedValue",
  //   render: (proposedValue) => (
  //     <>{proposedValue ? numberUtils.formatNumber(proposedValue) : ""}</>
  //   ),
  //   align: "right"
  // },
];

const mockData: Array<AssetLandValuationTableType> = [
  {
    key: 1,
    landUseRight: "Đất ở",
    valuationMethod: "So sánh",
    area: 60,
    planningInformation: "",
    PHQHArea: 60,
    notPHQHArea: 0,
    singlePrice: 38000000,
    proposedValue: 0,
    valuationValue: 2280000000,
  },
  {
    key: 2,
    landUseRight: "CTXĐ",
    valuationMethod: "So sánh",
    area: 60,
    planningInformation: "",
    PHQHArea: 60,
    notPHQHArea: 0,
    singlePrice: 38000000,
    proposedValue: 0,
    valuationValue: 2280000000,
  },
  {
    key: 3,
    landUseRight: "Tổng",
    valuationMethod: "",
    area: 120,
    planningInformation: "",
    PHQHArea: 120,
    notPHQHArea: 0,
    singlePrice: 76000000,
    proposedValue: 0,
    valuationValue: 4560000000,
  },
];

export { defaultColumns, mockData };
