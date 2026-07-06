import type { ColumnsType } from "antd/es/table";
import { formatDate } from "utils";

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
    title: "Mã nhân viên",
    dataIndex: "staffNumber",
  },
  {
    key: 3,
    title: "Tên nhân viên",
    dataIndex: "staffName",
  },
  {
    key: 3.5,
    title: "Phòng ban",
    dataIndex: "departmentName",
  },
  {
    key: 4,
    title: "Nhóm",
    dataIndex: "kpiGroupName",
  },
  {
    key: 5,
    title: "Hiệu lực từ ngày",
    dataIndex: "dateFrom",
    align: "left",
    render: (dateFrom: string) => {
      return dateFrom ? formatDate(dateFrom) : null;
    },
  },
  {
    key: 6,
    title: "Hiệu lực đến ngày",
    dataIndex: "dateTo",
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
