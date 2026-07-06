import type { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "stt",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 2,
    title: "Số TB",
    dataIndex: "soTB",
  },
  {
    key: 3,
    title: "Ngày TB",
    dataIndex: "ngayTB",
  },
  {
    key: 4,
    title: "Người lập",
    dataIndex: "nguoiLap",
  },
  {
    key: 5,
    title: "Số BT",
    dataIndex: "soBT",
  },
  {
    key: 6,
    title: "Trạng thái",
    dataIndex: "trangThai",
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "hanhDong",
    align: "center",
    width: "120px",
    fixed: "right",
  },
];

export { defaultColumns };
