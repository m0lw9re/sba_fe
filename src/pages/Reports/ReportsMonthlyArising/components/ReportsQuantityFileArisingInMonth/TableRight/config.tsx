import { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    title: "",
    width: "2%",
    key: "icon",
    align: "center",
    fixed: "left",
  },
  {
    title: "STT",
    dataIndex: "index",
    key: "key",
    fixed: "left",
  },
  {
    key: 1,
    title: "Khoản mục",
    dataIndex: "title",
    align: "left",
    fixed: "left",
    width: "20%",
    className: "titleBold",
  },
  {
    key: 2,
    title: "Số lượng",
    dataIndex: 1,
    align: "center",
  },
];

export { defaultColumns };
