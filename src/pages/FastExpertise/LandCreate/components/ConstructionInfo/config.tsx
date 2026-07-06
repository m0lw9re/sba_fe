import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { ColumnProps } from "constants/types/common.type";
const { SELECT, INPUT_NUMBER, INPUT } = TYPE_FIELD;
// const css = {xs: 24, sm: 24, md: 24, lg: 12, xl: 12};
// const wrapperCol = {xs: 20, sm: 20, md: 20, lg: 20, xl: 20};
// const labelCol = {xs: 4, sm: 4, md: 4, lg: 4, xl: 4};
const fields: InputFiledParams[] = [
  // {
  //   key: 1,
  //   name: "radio",
  //   type: RADIO,
  //   css: css,
  //   wrapperCol: wrapperCol,
  //   labelCol: labelCol,
  //   options: [
  //     {value: "true", label: "Có"},
  //     {value: "false", label: "Không"},
  //   ],
  // },
];
const columns: ColumnProps[] = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
    show: true,
    align: "center",
    render: (value: any, record: any, index: any) => {
      return <>{index + 1}</>;
    },
    width: 20,
  },
  {
    type: SELECT,
    dataIndex: "typeId",
    key: "typeId",
    title: "Loại công trình xây dựng",
    show: true,
    width: 140,
  },
  {
    type: INPUT,
    dataIndex: "type",
    key: "type",
    title: "",
    show: true,
    hidden: true,
    width: 0,
  },
  {
    type: SELECT,
    dataIndex: "name",
    key: "name",
    title: "Mô tả đặc tính kỹ thuật",
    show: true,
    width: 140,
  },
  {
    type: INPUT_NUMBER,
    dataIndex: "area",
    key: "area",
    title: "DT (m²)",
    show: true,
    width: 50,
    currencable: true,
  },
  {
    type: INPUT_NUMBER,
    dataIndex: "clcl",
    key: "clcl",
    title: "CLCL (%)",
    show: true,
    width: 50,
    percentable: true,
  },
  {
    type: INPUT_NUMBER,
    dataIndex: "mdht",
    key: "mdht",
    title: "MĐHT (%)",
    show: true,
    width: 50,
    percentable: true,
  },
  {
    type: INPUT_NUMBER,
    dataIndex: "unitPrice",
    key: "unitPrice",
    title: "Đơn giá (đồng/m²)",
    show: true,
    width: 50,
    currencable: true,
    disabled: true,
  },
  {
    type: INPUT_NUMBER,
    dataIndex: "value",
    key: "value",
    title: "Giá trị (đồng)",
    show: true,
    width: 80,
    currencable: true,
    disabled: true,
  },
  {
    dataIndex: "action",
    key: "action",
    show: true,
    align: "center",
    width: 20,
  },
];

export { fields, columns };
