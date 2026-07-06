import type { ColumnsType } from "antd/es/table";
import { formatDate, numberUtils } from "utils";

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
    title: "Tên nhóm",
    dataIndex: "kpiGroupName",
  },
  {
    key: 3,
    title: "Số HS hoàn thành tháng",
    dataIndex: "kpiHSMonth",
  },
  {
    key: 4,
    title: "Số HS hoàn thành năm",
    dataIndex: "kpiHSYear",
  },
  {
    key: 5,
    title: "Mức doanh thu tháng",
    dataIndex: "monthlyRevenue",
    align: "right",
    render: (monthlyRevenue: string) => {
      return monthlyRevenue ? numberUtils.formatNumber(monthlyRevenue) : null;
    },
  },
  {
    key: 6,
    title: "Mức doanh thu năm",
    dataIndex: "annualRevenue",
    align: "right",
    render: (annualRevenue: string) => {
      return annualRevenue ? numberUtils.formatNumber(annualRevenue) : null;
    },
  },
  {
    key: 5,
    title: "Hiệu lực từ ngày",
    dataIndex: "fromDate",
    align: "left",
    render: (dateFrom: string) => {
      return dateFrom ? formatDate(dateFrom) : null;
    },
  },
  {
    key: 6,
    title: "Hiệu lực đến ngày",
    dataIndex: "toDate",
    align: "left",
    render: (value: string) => {
      return value ? formatDate(value) : null;
    },
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
  },
];

export { defaultColumns };
