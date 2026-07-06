import { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    dataIndex: "username",
    title: "Tài khoản",
  },
  {
    key: 2,
    dataIndex: "staffName",
    title: "Họ tên",
  },
  {
    key: 3,
    dataIndex: "departmentCode",
    title: "Mã PB",
  },
];

export { defaultColumns };