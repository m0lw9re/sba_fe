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
    title: "Mã khu vực",
    dataIndex: "regionCode",
    align: "left",
  },
  {
    key: 3,
    title: "Tên khu vực",
    dataIndex: "regionName",
    align: "left",
  },
  // {
  //   key: 2,
  //   title: "Mã CN",
  //   dataIndex: "branchCode",
  //   align: "left",
  //   width: "10%",
  // },
  // {
  //   key: 3,
  //   title: "Tên CN",
  //   dataIndex: "branchName",
  //   align: "left",
  //   width: "15%",
  // },
  // {
  //   key: 4,
  //   title: "Địa chỉ",
  //   dataIndex: "address",
  //   align: "left",
  //   width: "30%",
  // },
  // {
  //   key: 5,
  //   title: "Email",
  //   dataIndex: "email",
  //   align: "left",
  //   width: "20%",
  // },
  // {
  //   key: 6,
  //   title: "Số điện thoại",
  //   dataIndex: "phoneNumber",
  //   align: "left",
  //   width: "15%",
  // },
  // {
  //   key: 7,
  //   title: "Hành động",
  //   dataIndex: "0",
  //   align: "center",
  //   width: "5%",
  // },
];

export { defaultColumns };
