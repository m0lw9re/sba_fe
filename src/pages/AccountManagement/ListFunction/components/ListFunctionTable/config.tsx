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
    title: "Tên chức năng",
    dataIndex: "name",
  },
  {
    key: 3,
    title: "Mô tả chi tiết",
    dataIndex: "description",
  },
  {
    key: 4,
    title: "Nhóm quyền",
    dataIndex: "permissionGroupName",
  },
];

export { defaultColumns };
