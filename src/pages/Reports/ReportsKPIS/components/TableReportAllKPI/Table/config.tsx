import type { ColumnsType } from "antd/es/table";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    width: "50px",
  },
  {
    key: 2,
    title: "Định giá viên",
    dataIndex: "staffName",
    align: "left",
    width: "200px",
  },
  {
    key: 3,
    title: "Số lượng HS hoàn thành",
    dataIndex: "finishAppraisalFile",
    align: "right",
    width: "100px",
    render: (value) =>
      value && numberUtils.formatNumber(Number(value.toFixed(1))),
  },
  {
    key: 3.5,
    title: "Quy đổi HS nội thành",
    dataIndex: "finishAppraisalFileTransferToUrban",
    align: "right",
    width: "100px",
    render: (value) =>
      value && numberUtils.formatNumber(Number(value.toFixed(1))),
  },
  {
    key: 4,
    title: "Tỉ lệ TH/KH",
    dataIndex: "propotionAppraisalFileKPI",
    align: "right",
    width: "100px",
  },
  {
    key: 5,
    title: "Doanh thu",
    dataIndex: "revenue",
    align: "right",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 6,
    title: "Tỉ lệ TH/KH",
    dataIndex: "propotionRevenueKPI",
    align: "right",
    width: "100px",
  },
  {
    key: 7,
    title: "Công nợ",
    dataIndex: "debt",
    align: "right",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 8,
    title: "Đã thu",
    dataIndex: "receive",
    align: "right",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
];

export { defaultColumns };
