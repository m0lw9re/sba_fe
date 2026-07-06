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
    title: "Mã chi nhánh",
    dataIndex: "code",
    align: "center",
  },
  {
    key: 3,
    title: "Tên chi nhánh",
    dataIndex: "companyBranchName",
    align: "center",
  },
  {
    key: 4,
    title: "Tỉnh/Thành phố",
    dataIndex: "addressProvinceName",
    align: "center",
  },
  {
    key: 5,
    title: "Quận/Huyện/Thị Xã",
    dataIndex: "addressDistrictName",
    align: "center",
  },
  {
    key: 6,
    title: "Xã/Phường/Thị trấn",
    dataIndex: "addressWardName",
    align: "center",
  },
  {
    key: 8,
    title: "Đường",
    dataIndex: "addressStreet",
    align: "center",
  },
  {
    key: 9,
    title: "Địa chỉ chi tiết",
    dataIndex: "addressDetail",
    align: "center",
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
  },
];

export { defaultColumns };
