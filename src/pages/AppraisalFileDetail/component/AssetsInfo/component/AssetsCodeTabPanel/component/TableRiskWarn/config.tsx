import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";

export const defaultColumns: ColumnsEdit = [
  {
    key: 1,
    title: "Loại CBRR",
    dataIndex: "typeRisk",
    width: "18%",
    selected: true,
  },
  {
    key: 2,
    title: "Nội dung CBRR",
    dataIndex: "contentRisk",
    width: "18%",
    selected: true,
  },
  {
    key: 3,
    title: "Cấp độ",
    dataIndex: "level",
    width: "18%",
    selected: true,
  },
  {
    key: 4,
    title: "Mô tả chi tiết CBRR",
    editable: true,
    dataIndex: "description",
    width: "44%",
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    align: "center",
    width: "10%",
  },
];
