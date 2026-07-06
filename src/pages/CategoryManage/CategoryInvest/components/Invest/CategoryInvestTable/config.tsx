import type { ColumnsType } from "antd/es/table";
import { numberUtils } from "utils";

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
    title: "Loại công trình",
    dataIndex: "constructionTypeName",
  },
  {
    key: 3,
    title: "Mô tả đặc tính kỹ thuật",
    dataIndex: "constructionName",
  },
  {
    key: 4,
    title: "Đơn giá thấp nhất",
    dataIndex: "lowPrice",
    align: "right",
    render: (text) => numberUtils.formatNumber(text),
  },
  {
    key: 5,
    title: "Đơn giá cao nhất",
    dataIndex: "highPrice",
    align: "right",
    render: (text) => numberUtils.formatNumber(text),
  },
  {
    key: 6,
    title: "Trạng thái",
    dataIndex: "isHidden",
    align: "center",
    render: (isHidden) => (isHidden ? "Ngưng hoạt động" : "Đang hoạt động"),
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
  },
];

export { defaultColumns };
