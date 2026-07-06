import type { ColumnsType } from "antd/es/table";
import { CollapseCustom } from "components/CollapseCustom";

interface DataType {
  key: React.Key;
  titleName: string;
}

interface ExpandDataType {
  key: React.ReactNode;
  assetCode: string;
  newPrice: string;
  oldPrice: string;
  increaseRate: string;
  oldBCDG: string;
  newBCDG: string;
  valuationTime: string;
  children?: DataType[];
}

const defaultColumns: ColumnsType<DataType> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 2,
    title: "Mã tài sản",
    dataIndex: "assetCode",
    align: "left",
  },
  {
    key: 3,
    title: "Giá mới",
    dataIndex: "newPrice",
    align: "right",
  },
  {
    key: 4,
    title: "Giá cũ",
    dataIndex: "oldPrice",
    align: "right",
  },
  {
    key: 5,
    title: "Tỷ lệ tăng",
    dataIndex: "increaseRate",
    align: "right",
  },
  {
    key: 6,
    title: "BCĐG cũ",
    dataIndex: "oldBCDG",
    align: "center",
  },
  {
    key: 8,
    title: "BCĐG mới",
    dataIndex: "newBCDG",
    align: "center",
  },
  {
    key: 9,
    title: "Thời gian định giá",
    dataIndex: "valuationTime",
    align: "center",
  },
  {
    key: 10,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
  },
];

const data: ExpandDataType[] = [
  {
    key: 11,
    assetCode: "TSD192910",
    newPrice: "700,000,000",
    oldPrice: "900,000,000",
    increaseRate: "10%",
    oldBCDG: "011120/BĐS/23/TD",
    newBCDG: "100,000,000",
    valuationTime: "6 tháng trước",
  },
  {
    key: 12,
    assetCode: "TSD192910",
    newPrice: "700,000,000",
    oldPrice: "900,000,000",
    increaseRate: "10%",
    oldBCDG: "011120/BĐS/23/TD",
    newBCDG: "100,000,000",
    valuationTime: "6 tháng trước",
  },
  {
    key: 13,
    assetCode: "TSD192910",
    newPrice: "700,000,000",
    oldPrice: "900,000,000",
    increaseRate: "10%",
    oldBCDG: "011120/BĐS/23/TD",
    newBCDG: "100,000,000",
    valuationTime: "6 tháng trước",
  },
  {
    key: 14,
    assetCode: "TSD192910",
    newPrice: "700,000,000",
    oldPrice: "900,000,000",
    increaseRate: "10%",
    oldBCDG: "011120/BĐS/23/TD",
    newBCDG: "100,000,000",
    valuationTime: "6 tháng trước",
  },
  {
    key: 15,
    assetCode: "TSD192910",
    newPrice: "700,000,000",
    oldPrice: "900,000,000",
    increaseRate: "10%",
    oldBCDG: "011120/BĐS/23/TD",
    newBCDG: "100,000,000",
    valuationTime: "6 tháng trước",
  },
  {
    key: 16,
    assetCode: "TSD192910",
    newPrice: "700,000,000",
    oldPrice: "900,000,000",
    increaseRate: "10%",
    oldBCDG: "011120/BĐS/23/TD",
    newBCDG: "100,000,000",
    valuationTime: "6 tháng trước",
  },
  {
    key: 17,
    assetCode: "TSD192910",
    newPrice: "700,000,000",
    oldPrice: "900,000,000",
    increaseRate: "10%",
    oldBCDG: "011120/BĐS/23/TD",
    newBCDG: "100,000,000",
    valuationTime: "6 tháng trước",
  },
  {
    key: 18,
    assetCode: "TSD192910",
    newPrice: "700,000,000",
    oldPrice: "900,000,000",
    increaseRate: "10%",
    oldBCDG: "011120/BĐS/23/TD",
    newBCDG: "100,000,000",
    valuationTime: "6 tháng trước",
  },
];

export { data, defaultColumns };
