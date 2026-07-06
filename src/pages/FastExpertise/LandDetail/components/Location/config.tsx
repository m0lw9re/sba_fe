import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
const { INPUT, SELECT } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const fields1: InputFiledParams[] = [
  {
    key: 1,
    label: "Số thửa",
    name: "date",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    require: true,
  },
  {
    key: 2,
    label: "Số tờ bản đồ",
    name: "",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    require: true,
  },
];
const columns: any[] = [
  {
    title: "Địa chỉ",
    dataIndex: "stt",
    key: "stt",
    render: (text: any) => {
      return <>Hồ sơ pháp lý</>;
    },
    width: 100,
    show: true,
    align: "center",
  },

  {
    type: SELECT,
    dataIndex: "soLo",
    key: "soLo",
    title: "Tỉnh/Thành phố",
    show: true,
  },
  {
    type: SELECT,
    dataIndex: "soLo",
    key: "soLo",
    title: "Quận/Huyện/Thị xã",
    show: true,
  },
  {
    type: SELECT,
    dataIndex: "soLo",
    key: "soLo",
    title: "Xã/Phường/Thị Trấn",
    show: true,
  },
  {
    type: INPUT,
    dataIndex: "soLo",
    key: "soLo",
    title: "Đường phố",
    show: true,
  },
  {
    type: INPUT,
    dataIndex: "soLo",
    key: "soLo",
    title: "Chi tiết",
    show: true,
  },
];
const fields2: InputFiledParams[] = [
  {
    key: 1,
    label: "Diện tích khuân viên (m²)",
    name: "1",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    require: true,
  },
  {
    key: 2,
    label: "Diện tích phù hợp quy hoạch (m²)",
    name: "2",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    require: true,
  },
  {
    key: 3,
    label: "Diện tích không phù hợp quy hoạch (m²)",
    name: "3",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    require: true,
  },
  {
    key: 4,
    label: "Mục đích sử dụng đất",
    name: "4",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    require: true,
  },
  {
    key: 5,
    label: "Hình dạng",
    name: "5",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 6,
    label: "Số mặt tiền/mặt thoáng",
    name: "6",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 7,
    label: "Kích thước mặt tiền (m)",
    name: "7",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 8,
    label: "Đoạn đường trong khung giá",
    name: "8",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 9,
    label: "Loại đường tiếp giáp",
    name: "9",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 10,
    label: "Vị trí",
    name: "10",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 11,
    label: "Độ rộng đường (m)",
    name: "",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
];

export { fields1, fields2, columns };
