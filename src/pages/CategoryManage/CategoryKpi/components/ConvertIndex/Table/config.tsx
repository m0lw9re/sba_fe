import { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    render: (text, record, rowIndex) => rowIndex + 1,
    align: "center",
    width: 60,
  },
  {
    key: 2,
    title: "Loại hồ sơ",
    dataIndex: "type",
    width: 400,
  },
  {
    key: 3,
    title: "Hệ số",
    dataIndex: "profileCoefficient",
    align: "right",
  },
  {
    key: 4,
    title: "Ghi chú",
    dataIndex: "description",
  },

  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: 120,
  },
];

export { defaultColumns };
