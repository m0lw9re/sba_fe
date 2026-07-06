import { ColumnsType } from "antd/es/table";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    title: "",
    width: "2%",
    key: "icon",
    align: "center",
    fixed: "left",
  },
  {
    title: "STT",
    dataIndex: "index",
    key: "key",
    fixed: "left",
    width: "50px",
    align: "center",
  },
  {
    key: 1,
    title: "Khoản mục",
    dataIndex: "title",
    align: "left",
    fixed: "left",
    width: "20%",
    className: "titleBold",
  },
  {
    key: 14,
    title: "Tổng",
    dataIndex: "total",
    align: "center",
    render: (value) => numberUtils.formatNumber(value),
  },
];

export { defaultColumns };
