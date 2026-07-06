import type { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    width: 60,
  },
  {
    key: 2,
    title: "Loại tài sản",
    dataIndex: "assetLevelOneId",
    align: "left",
  },
  {
    key: 3,
    title: "Thời gian hiệu lực (ngày)",
    dataIndex: "expirationDate",
    align: "right",
    width: 200,
  },
  {
    key: 4,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: 120,
  },
];

export { defaultColumns };
