import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
const { INPUT, SELECT, RADIO, MULTI_ITEMS } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 20, xl: 20 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 4, xl: 4 };
const fields: InputFiledParams[] = [
  {
    key: 1,

    name: "radio",
    type: RADIO,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    options: [
      { value: "true", label: "Có" },
      { value: "false", label: "Không" },
    ],
  },
];
const columns: any[] = [
  {
    title: "Mã",
    dataIndex: "stt",
    key: "stt",

    width: 100,
    show: true,
    align: "center",
  },

  {
    type: MULTI_ITEMS,
    dataIndex: "soLo",
    key: "soLo",
    title: "Loại công trình xây dựng",
    show: true,
    fields: [
      { type: SELECT, dataIndex: "test", key: "test", span: 8 },
      { type: SELECT, dataIndex: "test", key: "test", span: 8 },
      { type: INPUT, dataIndex: "test", key: "test", span: 8 },
    ],
  },
  {
    type: MULTI_ITEMS,
    dataIndex: "soLo",
    key: "soLo",
    title: "Diện tích sử dụng (m²)",
    show: true,
    fields: [
      { type: SELECT, dataIndex: "test", key: "test", span: 8 },
      { type: INPUT, dataIndex: "test", key: "test", span: 8 },
      { type: INPUT, dataIndex: "test", key: "test", span: 8 },
    ],
  },
  {
    type: MULTI_ITEMS,
    dataIndex: "soLo",
    key: "soLo",
    title: "CLCL (%)",
    show: true,
    fields: [
      { type: INPUT, dataIndex: "test", key: "test", span: 8 },
      { type: INPUT, dataIndex: "test", key: "test", span: 8 },
      { type: INPUT, dataIndex: "test", key: "test", span: 8 },
    ],
  },
  {
    type: MULTI_ITEMS,
    dataIndex: "soLo",
    key: "soLo",
    title: "MĐHT (%)",
    show: true,
    fields: [
      { type: INPUT, dataIndex: "test", key: "test", span: 8 },
      { type: INPUT, dataIndex: "test", key: "test", span: 8 },
      { type: INPUT, dataIndex: "test", key: "test", span: 8 },
    ],
  },
  {
    dataIndex: "action",
    key: "action",
    show: true,
    align: "center",
  },
];

export { fields, columns };
