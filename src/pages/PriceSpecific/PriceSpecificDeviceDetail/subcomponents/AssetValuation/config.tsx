import { ColumnsType } from "antd/es/table";
import { AssetLandValuationTableType } from "constant/types";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "Quyển sử dụng máy móc",
    dataIndex: "assetName",
    align: "left",
  },
  {
    key: 2,
    title: "Phương pháp định giá",
    dataIndex: "valuationMethodName",
    align: "left",
  },
  {
    key: 7,
    title: "Đơn giá (đồng/m²)",
    dataIndex: "unitPriceApprovaled",
    render: (unitPriceApprovaled) => (
      <>
        {unitPriceApprovaled
          ? numberUtils.formatNumber(unitPriceApprovaled)
          : ""}
      </>
    ),
    align: "right",
  },
  {
    key: 8,
    title: "Giá trị định giá (đồng)",
    dataIndex: "totalValueApprovaled",
    render: (totalValueApprovaled) => (
      <>
        {totalValueApprovaled
          ? numberUtils.formatNumber(totalValueApprovaled)
          : ""}
      </>
    ),
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
