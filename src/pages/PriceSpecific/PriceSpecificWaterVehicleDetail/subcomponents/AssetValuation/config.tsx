import { ColumnsType } from "antd/es/table";
import { AssetLandValuationTableType } from "constant/types";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "Quyển sử dụng tài sản",
    dataIndex: "landUseRight",
  },
  {
    key: 2,
    title: "Phương pháp định giá",
    dataIndex: "valuationMethod",
  },
  {
    key: 3,
    title: "Đơn giá (đồng/m²)",
    dataIndex: "planningInformation",
  },
  {
    key: 4,
    title: "Giá trị định giá (đồng)",
    dataIndex: "valuationValue",
    render: (valuationValue) => (
      <>{valuationValue ? numberUtils.formatNumber(valuationValue) : ""}</>
    ),
  },
  {
    key: 5,
    title: "Giá trị định giá đề xuất (đồng)",
    dataIndex: "proposedValue",
    render: (proposedValue) => (
      <>{proposedValue ? numberUtils.formatNumber(proposedValue) : ""}</>
    ),
  },
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
