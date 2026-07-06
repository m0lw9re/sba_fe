import type { ColumnsType } from "antd/es/table";
import { formatDate, numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 0,
    title: "STT",
    dataIndex: "times",
    align: "center",
    fixed: "left",
    width: "50px",
  },
  {
    key: 1,
    title: "Nội dung",
    dataIndex: "content",
    align: "left",
    fixed: "left",
    width: "200px",
  },
  {
    key: 2,
    title: "Đầu kỳ",
    dataIndex: "atBegin",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 3,
    title: "Phát sinh trong kỳ",
    dataIndex: "createNew",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 4,
    title: "Đã thu",
    dataIndex: "cashed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 5,
    title: "Không nhận kết quả",
    dataIndex: "noReceiveResult",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 6,
    title: "Giảm / điều chỉnh",
    dataIndex: "reduce",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 7,
    title: "GNNB",
    dataIndex: "internalRecord",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 8,
    title: "Hoàn trả",
    dataIndex: "cashBack",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 10,
    title: "Tồn cuối kỳ",
    dataIndex: "atEnd",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
];

export { defaultColumns };