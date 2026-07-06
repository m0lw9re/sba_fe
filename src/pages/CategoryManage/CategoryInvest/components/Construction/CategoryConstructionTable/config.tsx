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
    title: "Tên CTXD",
    dataIndex: "constructionTypeName",
  },
  // {
  //   key: 3,
  //   title: "Mô tả",
  //   dataIndex: "description",
  // },
  {
    key: 4,
    title: "Trạng thái",
    dataIndex: "hidden",
    align: "center",
    width: "150px",
    render: (hidden) => (hidden ? "Ngưng hoạt động" : "Đang hoạt động"),
  },
  {
    key: 5,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: "100px",
  },
];

export { defaultColumns };
