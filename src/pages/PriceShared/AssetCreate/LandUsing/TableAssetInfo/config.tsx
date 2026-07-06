import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import * as Yup from "yup";

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


const landUsingFormSchema = Yup.object().shape({
  compareAssets: Yup.array().of(
    Yup.object().shape({
      remainQuality: Yup.number().nullable().integer("Chỉ được nhập số nguyên")
    }))
})

export { columnsTb, landUsingFormSchema };


