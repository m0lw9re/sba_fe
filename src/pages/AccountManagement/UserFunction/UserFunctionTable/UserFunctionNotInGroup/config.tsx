import { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    dataIndex: "functionCode",
    title: "Mã chức năng",
  },
  {
    key: 2,
    dataIndex: "functionName",
    title: "Tên chức năng",
  },
];

export { defaultColumns };
