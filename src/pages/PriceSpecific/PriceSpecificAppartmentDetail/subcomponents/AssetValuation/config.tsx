import { ColumnsType } from "antd/es/table";
import { AssetLandValuationTableType } from "constant/types";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "Quyển sử dụng tài sản",
    dataIndex: "assetName",
    align: "left",
  },
  {
    key: 5,
    title: "Căn hộ",
    dataIndex: "assetChildName",
    align: "left",
  },
  {
    key: 2,
    title: "Phương pháp định giá",
    dataIndex: "valuationMethodName",
    align: "left",
  },
  {
    key: 3,
    title: "Diện tích sử dụng riêng (m²)",
    dataIndex: "totalAreaApprovaled",
    align: "center",
    render: (totalAreaApprovaled, record) => (
      <>{numberUtils.formatNumber(totalAreaApprovaled)}</>
    ),
  },
  // {
  //   key: 5,
  //   title: "Diện tích tim tường (m²)",
  //   dataIndex: "buildupArea",
  //   align: "left"
  // },
  // {
  //   key: 6,
  //   title: "Diện tích quy đổi (m²)",
  //   dataIndex: "extendArea",
  //   align: "left"
  // },
  {
    key: 7,
    title: "Đơn giá (đồng/m²)",
    dataIndex: "unitPriceApprovaled",
    align: "right",
    render: (unitPriceApprovaled) => (
      <>
        {unitPriceApprovaled
          ? numberUtils.formatNumber(unitPriceApprovaled)
          : ""}
      </>
    ),
  },
  {
    key: 8,
    title: "Giá trị định giá (đồng)",
    dataIndex: "totalValueApprovaled",
    align: "right",
    render: (totalValueApprovaled) => (
      <>
        {totalValueApprovaled
          ? numberUtils.formatNumber(totalValueApprovaled)
          : ""}
      </>
    ),
  },
  // {
  //   key: 9,
  //   title: "Giá trị định giá đề xuất (đồng)",
  //   dataIndex: "proposedValue",
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
