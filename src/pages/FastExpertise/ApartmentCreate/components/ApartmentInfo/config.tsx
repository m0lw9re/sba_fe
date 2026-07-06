import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
import { ColumnProps } from "constants/types/common.type";
const { INPUT, SELECT, INPUT_NUMBER } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const wrapperCol = { xs: 20, sm: 20, md: 20, lg: 16, xl: 16 };
const labelCol = { xs: 4, sm: 4, md: 4, lg: 8, xl: 8 };
const fields1: InputFiledParams[] = [
  {
    key: 1,
    label: "Số sổ",
    name: "codeBook",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    // rules: [{ required: true, message: "Chưa nhập số thửa" }],
  },
  {
    key: 2,
    label: "Số tờ bản đồ",
    name: "mapSheetNumber",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    // rules: [{ required: true, message: "Chưa nhập số tờ bản đồ" }],
  },
];
const columns: ColumnProps[] = [
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
    dataIndex: "addressProvince",
    key: "addressProvince",
    title: "Tỉnh/Thành phố (*)",
    show: true,
    rules: [{ required: true, message: "Chưa chọn Tỉnh/Thành phố" }],
  },
  {
    type: SELECT,
    dataIndex: "addressDistrict",
    key: "addressDistrict",
    title: "Quận/Huyện/TP/Thị xã (*)",
    show: true,
    rules: [{ required: true, message: "Chưa chọn Quận/Huyện/TP/Thị xã" }],
  },
  {
    type: SELECT,
    dataIndex: "addressWard",
    key: "addressWard",
    title: "Xã/Phường/Thị trấn (*)",
    show: true,

    rules: [{ required: true, message: "Chưa chọn Xã/Phường/Thị trấn" }],
  },
  {
    type: INPUT,
    dataIndex: "addressStreet",
    key: "addressStreet",
    title: "Đường phố",
    show: true,
  },
  {
    type: INPUT,
    dataIndex: "addressDetail",
    key: "addressDetail",
    title: "Chi tiết",
    show: true,
  },
];
const fields2: any[] = [
  {
    key: 3,
    label: "Tên chung cư/dự án",
    name: "projectId",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    rules: [{ required: true, message: "Chưa chọn CC/Dự án" }],
  },
  {
    key: 4,
    label: "Tòa nhà thực tế",
    name: "buildingId",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 5,
    label: "Số tầng tòa nhà",
    name: "totalFloor",
    type: INPUT_NUMBER,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    currencable: true,
    rules: [
      { required: true, message: "Nhập số tầng" },
      {
        validator: (_: any, value: number) => {
          if (Number(value) < 0 || Number(value) > 99) {
            return Promise.reject(new Error("Số tầng trong khoảng 1-99"));
          }
          return Promise.resolve();
        },
      },
    ],
  },
  {
    key: 6,
    label: "Block",
    name: "blockId",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 7,
    label: "Phạm vi bán kính (km)",
    name: "radius",
    type: INPUT_NUMBER,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    currencable: true,
  },
  {
    key: 8,
    label: "Tỉnh/Thành phố",
    name: "addressProvince",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    rules: [{ required: true, message: "Chưa chọn Tỉnh/TP" }],
  },
  {
    key: 9,
    label: "Quận/Huyện/TP/Thị xã",
    name: "addressDistrict",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    rules: [{ required: true, message: "Chưa chọn Quận/Huyện/TP/Thị xã" }],
  },
  {
    key: 10,
    label: "Xã/Phường/Thị trấn",
    name: "addressWard",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    rules: [{ required: true, message: "Chưa chọn Xã/Phường/Thị trấn" }],
  },
  {
    key: 11,
    label: "Đường phố",
    name: "addressStreet",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 12,
    label: "Chi tiết",
    name: "addressDetail",
    type: INPUT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
  },
  {
    key: 13,
    label: "Số mặt thoáng",
    name: "surfaces",
    type: SELECT,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    defaultValue: 1,
    showSearch: false,
    options: [
      { value: 1, label: "1" },
      { value: 2, label: "2" },
      { value: 3, label: "3" },
      { value: 4, label: "4" },
    ],
    rules: [{ required: true, message: "Chọn số mặt thoáng" }],
  },
  {
    key: 14,
    label: "Tầng số",
    name: "floorNo",
    type: INPUT_NUMBER,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    currencable: true,
    min: 1,
    max: 99,
    rules: [
      { required: true, message: "Nhập tầng số" },
      {
        validator: (_: any, value: number) => {
          if (Number(value) < 0 || Number(value) > 99) {
            return Promise.reject(new Error("Giá trị trong khoảng 1-99"));
          }
          return Promise.resolve();
        },
      },
    ],
  },

  {
    key: 14,
    label: "Tọa độ (X)",
    name: "latitude",
    type: INPUT_NUMBER,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    currencable: true,
  },
  {
    key: 16,
    label: "Tọa độ (Y)",
    name: "longitude",
    type: INPUT_NUMBER,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    currencable: true,
  },
  {
    key: 17,
    label: "Diện tích thông thủy (m²)",
    name: "clearanceArea",
    type: INPUT_NUMBER,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    currencable: true,
  },
  {
    key: 18,
    label: "Diện tích sử dụng riêng (m²)",
    name: "privateUseArea",
    type: INPUT_NUMBER,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    currencable: true,
    rules: [{ required: true, message: "Nhập diện tích sử dụng riêng" }],
  },

  {
    key: 19,
    label: "Diện tích tim tường (m²)",
    name: "buildupArea",
    type: INPUT_NUMBER,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    currencable: true,
  },
  {
    key: 20,
    label: "Diện tích cơi nới (m²)",
    name: "extendArea",
    type: INPUT_NUMBER,
    css: css,
    wrapperCol: wrapperCol,
    labelCol: labelCol,
    currencable: true,
  },
];

export { fields1, fields2, columns };
