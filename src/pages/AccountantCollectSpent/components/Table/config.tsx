import type { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    width: "5%",
    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 2,
    title: "Mã khoản",
    dataIndex: "expentId",
    width: "10%",
  },
  {
    key: 3,
    title: "Tên khoản",
    dataIndex: "expentName",
    width: "20%",
  },
  {
    key: 4,
    title: "Loại",
    dataIndex: "type",
    width: "20%",
  },
  {
    key: 5,
    title: "Ghi chú",
    dataIndex: "description",
  },
  {
    key: 6,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: "10%",
  },
];

export { defaultColumns };
