import type { ColumnsType } from "antd/es/table";
import { formatDate, numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 0,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    fixed: "left",
    width: "50px",
  },
  {
    key: 2,
    title: "Số hồ sơ",
    dataIndex: "reportCode",
    align: "left",
    fixed: "left",
    width: "200px",
  },
  {
    key: 3,
    title: "Trạng thái",
    dataIndex: "fileStatus",
    align: "left",
    width: "200px",
  },
  {
    key: 4,
    title: "Tên khách hàng",
    dataIndex: "customerName",
    align: "left",
    width: "200px",
  },
  {
    key: 5,
    title: "Địa chỉ thẩm định",
    dataIndex: "estimateAddress",
    align: "left",
    width: "200px",
  },
  {
    key: 6,
    title: "Chi nhánh / PGD",
    dataIndex: "branch",
    align: "left",
    width: "200px",
  },
  {
    key: 7,
    title: "Tổng phí hồ sơ",
    dataIndex: "totalFee",
    align: "right",
    width: "180px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 8,
    title: "Đã thu",
    dataIndex: "cashed",
    align: "right",
    width: "180px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 9,
    title: "Doanh thu (Đã xuất hoá đơn)",
    dataIndex: "revenue",
    align: "right",
    width: "180px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 10,
    title: "Ngày xuất hoá đơn phí đợt 1",
    dataIndex: "exportBillFeeOneDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 11,
    title: "Ngày xuất hoá đơn phí đợt 2",
    dataIndex: "exportBillFeeTwoDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 12,
    title: "Giảm phí",
    dataIndex: "reduceFee",
    align: "right",
    width: "180px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 13,
    title: "GNNB",
    dataIndex: "internalRecord",
    align: "right",
    width: "180px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 14,
    title: "Hoàn trả",
    dataIndex: "payback",
    align: "right",
    width: "180px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 15,
    title: "Công nợ phải thu",
    dataIndex: "debt",
    align: "right",
    width: "180px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
];

export { defaultColumns };