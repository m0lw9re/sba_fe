import type { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 2,
    title: "Nội dung cảnh báo",
    dataIndex: "riskContent",
    width: "73%",
  },
  {
    key: 3,
    title: "Mức độ",
    dataIndex: "riskLevel",
  },
  {
    key: 4,
    title: "Loại tài sản",
    dataIndex: "assetLevelTwoName",
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
  },
];

export { defaultColumns };
