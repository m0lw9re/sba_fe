import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";

const columnsTb: ColumnsEdit = [
  {
    title: "Nội dung",
    dataIndex: "name",
    key: "name",
    colSpan: 2,
  },
  {
    title: "lable",
    dataIndex: "lable",
    key: "lable",
    colSpan: 0,
  },
  {
    title: "TS 1",
    dataIndex: "ts1",
    key: "ts1",
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
  },
];

export { columnsTb };
