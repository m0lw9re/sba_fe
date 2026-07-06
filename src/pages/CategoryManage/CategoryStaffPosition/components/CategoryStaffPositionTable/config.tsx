import type { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    width: "5%",
  },
  {
    key: 2,
    title: "Mã vị trí",
    dataIndex: "term",
    width: "20%",
  },
  {
    key: 3,
    title: "Tên vị trí",
    dataIndex: "positionName",
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: "10%",
  },
];

export { defaultColumns };
