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
    title: "Mã PGD",
    dataIndex: "transOfficeCode",
    align: "left",
  },
  {
    key: 3,
    title: "Tên PGD",
    dataIndex: "transOfficeName",
    align: "left",
  },
  {
    key: 4,
    title: "Địa chỉ",
    dataIndex: "address",
    align: "left",
  },
  {
    key: 5,
    title: "Email",
    dataIndex: "email",
    align: "left",
  },
  {
    key: 6,
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    align: "left",
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
  },
];

export { defaultColumns };
