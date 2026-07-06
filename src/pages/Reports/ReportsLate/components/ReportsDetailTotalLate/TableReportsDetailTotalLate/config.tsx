import type { ColumnsType } from "antd/es/table";
import { formatDate } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 0,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    width: "48px",
    fixed: "left"
  },
  {
    key: 1,
    title: "Số hồ sơ SBA",
    dataIndex: "reportCode",
    align: "left",
    width: "127px",
    fixed: "left"
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
    title: "Ngày phân công",
    dataIndex: "timeAssigned",
    align: "left",
    width: "127px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 4,
    title: "Ngày KS/bổ sung",
    dataIndex: "surveyTime",
    align: "left",
    width: "127px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 5,
    title: "Định giá viên",
    dataIndex: "staffName",
    align: "left",
    width: "127px",
  },
  {
    key: 6,
    title: "Chi nhánh",
    dataIndex: "branchName",
    align: "left",
    width: "127px",
  },
  {
    key: 7,
    title: "PGD",
    dataIndex: "transOfficeName",
    align: "left",
    width: "127px",
  },
  {
    key: 8,
    title: "Khu vực",
    dataIndex: "regionName",
    align: "left",
    width: "150px",
  },
  {
    key: 9,
    title: "Tên khách hàng",
    dataIndex: "customerName",
    align: "left",
    width: "127px",
  },
  {
    key: 10,
    title: "Địa điểm thẩm định",
    dataIndex: "address",
    align: "left",
    width: "180px",
  },
  {
    key: 12,
    title: "Tỉnh",
    dataIndex: "provinceName",
    align: "left",
    width: "127px",
  },
  {
    key: 13,
    title: "Lý do",
    dataIndex: "reason",
    align: "left",
    width: "127px",
  },
  {
    key: 14,
    title: "Số ngày trễ",
    dataIndex: "delayDate",
    align: "left",
    width: "127px",
  },
  {
    key: 15,
    title: "Trạng thái hồ sơ",
    dataIndex: "fileStatus",
    align: "left",
    width: "127px",
  },
];

export { defaultColumns };
