import { ColumnsType } from "antd/es/table";
import { AssetLandValuationTableType } from "constant/types";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "Mục đích sử dụng đất",
    dataIndex: "usingPurposeName",
    align: "left",
  },
  {
    key: 2,
    title: "Diện tích khuôn viên (m²)",
    dataIndex: "areaWidth",
    align: "right",
    render: (areaWidth) => numberUtils.formatNumber(areaWidth),
  },
  {
    key: 5,
    title: "Diện tích PHQH (m²)",
    dataIndex: "areaInplan",
    align: "right",
    render: (areaInplan) => numberUtils.formatNumber(areaInplan),
  },
  {
    key: 6,
    title: "Diện tích không PHQH (m²)",
    dataIndex: "areaUnplan",
    align: "right",
    render: (areaUnplan) => numberUtils.formatNumber(areaUnplan),
  },
  {
    key: 7,
    title: "Giá trị CTXD (đồng)",
    dataIndex: "constructionPrice",
    render: (constructionPrice) => numberUtils.formatNumber(constructionPrice),
    align: "right",
  },
  {
    key: 8,
    title: "Giá rao bán (đồng)",
    dataIndex: "estimatePrice",
    render: (estimatePrice) => numberUtils.formatNumber(estimatePrice),
    align: "right",
  },
  {
    key: 8,
    title: "Giá thương lượng (đồng)",
    dataIndex: "transactionPrice",
    render: (transactionPrice) => numberUtils.formatNumber(transactionPrice),
    align: "right",
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
