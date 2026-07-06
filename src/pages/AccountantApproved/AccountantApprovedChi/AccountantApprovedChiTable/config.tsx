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
    title: "Số CT",
    dataIndex: "documentId",
  },
  {
    key: 3,
    title: "Ngày CT",
    dataIndex: "documentDate",
  },
  {
    key: 4,
    title: "Người lập",
    dataIndex: "staffName",
  },
  {
    key: 5,
    title: "Số BT",
    dataIndex: "btNumber",
  },
  {
    key: 6,
    title: "Trạng thái",
    dataIndex: "status",
  },
  {
    key: 7,
    align: "center",
    title: "Hành động",
    width: "15%",
  },
];

export { defaultColumns };
