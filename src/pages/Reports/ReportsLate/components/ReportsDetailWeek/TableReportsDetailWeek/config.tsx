import type { ColumnsType } from "antd/es/table";
import { formatDate } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 0,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    width: "50px",
    fixed: "left"
  },
  {
    key: 1,
    title: "Số hồ sơ SBA",
    dataIndex: "reportCode",
    align: "left",
    fixed: "left", 
    width: "100px",
  },
  {
    key: 2,
    title: "Ngày nhận",
    dataIndex: "proposalDate",
    align: "left",
    width: "127px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 3,
    title: "ĐGV",
    dataIndex: "staffName",
    align: "left",
    width: "127px",
  },
  {
    key: 4,
    title: "Chi nhánh",
    dataIndex: "branchName",
    align: "left",
    width: "127px",
  },
  {
    key: 5,
    title: "Khu vực",
    dataIndex: "regionName",
    align: "left",
    width: "127px",
  },
  {
    key: 6,
    title: "Tên khách hàng",
    dataIndex: "customerName",
    align: "left",
    width: "127px",
  },
  {
    key: 7,
    title: "Địa chỉ thẩm định",
    dataIndex: "address",
    align: "left",
    width: "200px",
  },
  {
    key: 8,
    title: "Tỉnh/TP",
    dataIndex: "provinceName",
    align: "left",
    width: "127px",
  },
  {
    key: 9,
    title: "Trạng thái hồ sơ",
    dataIndex: "fileStatus",
    align: "left",
    width: "127px",
  },
];

export { defaultColumns };
