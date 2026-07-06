import { ArrowRightSVG } from "assets";
import renderRequired from "components/RenderRequire";

import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { TYPE_FIELD } from "constant/enums";
import { InputFiledParams } from "constants/types/Form_Field_type";
const { SELECT, INPUT } = TYPE_FIELD;
const css = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 };
const cssLabel = { xs: 6, sm: 6, md: 6, lg: 6, xl: 6 };
const cssInput = { xs: 18, sm: 18, md: 18, lg: 18, xl: 18 };

export type Risk = {
  address: any;
  province: number | string;
  district: number | string;
  commune: number | string;
  street: string;
  detail: string;
};

export const defaultColumns: ColumnsEdit = [
  {
    key: 1,
    title: "Địa chỉ tài sản",
    dataIndex: "address",
    width: "15%",
  },
  {
    key: 2,
    title: "Tỉnh/Thành phố",
    dataIndex: "province",
    width: "15%",
    selected: true,
  },
  {
    key: 3,
    title: "Quận/Huyện/Thị xã",
    dataIndex: "district",
    width: "15%",
    selected: true,
  },
  {
    key: 4,
    title: "Xã/Phường/Thị trấn",
    selected: true,
    dataIndex: "commune",
    width: "15%",
  },
  {
    title: "Đường phố",
    dataIndex: "street",
    key: "street",
    align: "center",
    width: "15%",
    editable: true,
  },
  {
    title: "Chi tiết",
    dataIndex: "    ",
    key: "detail",
    align: "center",
    width: "15%",
    editable: true,
  },
];

export const defaultColumns2: ColumnsEdit = [
  {
    key: 1,
    title: "Đặc điểm",
    dataIndex: "type",
    width: "30%",
  },
  {
    key: 2,
    title: "HSPL",
    dataIndex: "hspl",
    width: "30%",
    editable: true,
  },
  {
    key: 3,
    title: <ArrowRightSVG />,
    dataIndex: "icon",
    width: "5%",
  },
  {
    key: 4,
    title: "Thực tế",
    editable: true,
    dataIndex: "real",
    width: "30%",
  },
];

export const mockData: Array<Risk> = [
  {
    address: renderRequired("Hồ sơ pháp lý"),
    province: "HT nhập và cho sửa",
    detail: "HT nhập và cho sửa",
    street: "HT nhập và cho sửa",
    commune: "HT nhập và cho sửa",
    district: "HT nhập và cho sửa",
    // value: 'HT nhập và cho sửa'
  },
  {
    address: renderRequired("Thực tế"),
    province: "HT nhập và cho sửa",
    detail: "HT nhập và cho sửa",
    street: "HT nhập và cho sửa",
    commune: "HT nhập và cho sửa",
    district: "HT nhập và cho sửa",
    // value: 'HT nhập và cho sửa'
  },
];
export const mockData2: Array<any> = [
  {
    type: renderRequired("Mã căn hộ"),
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: renderRequired("Tầng số"),
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: renderRequired("Số phòng ngủ"),
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: renderRequired("Số phòng WC"),
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: "Nội thất căn hộ",
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: renderRequired("Số mặt thoáng"),
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: renderRequired("Hướng ban công chính"),
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: renderRequired("Diện tích sử dụng riêng (m²)"),
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: "Diện tích thông thuỷ (m²)",
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: "Diện tích tim tường (m²)",
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
  {
    type: "Diện tích cơi nới (m²)",
    hspl: "STB nhập và cho sửa",
    icon: "",
    real: "Hệ thống tự nhập và cho sửa",
  },
];

export const mokeTypeRisk = [
  {
    value: 0,
    label: "Hồ sơ pháp lý",
  },
  {
    value: 1,
    label: "Hiện trạng tài sản",
  },
  {
    value: 2,
    label: "Xác định giá trị",
  },
];

export const mokeContRisk = [
  {
    value: 0,
    label: "Nội dung 1",
  },
  {
    value: 1,
    label: "Nội dung 2",
  },
  {
    value: 2,
    label: "Nội dung 3",
  },
];

export const inputs: InputFiledParams[] = [
  {
    key: 1,
    label: "Số sổ",
    require: true,
    type: INPUT,
    placeholder: "Nhập",
    css: css,
    labelCol: cssLabel,
    wrapperCol: cssInput,
  },
  {
    key: 2,
    label: "Số tờ bản đồ",
    type: INPUT,
    placeholder: "Nhập",
    css: css,
    labelCol: cssLabel,
    wrapperCol: cssInput,
  },
];

export const inputs1: InputFiledParams[] = [
  {
    key: 1,
    label: "Toà nhà thực tế",
    type: SELECT,
    placeholder: "Nhập",
    css: css,
    labelCol: cssLabel,
    wrapperCol: cssInput,
    value: "HT nhập và cho sửa",
  },
  {
    key: 2,
    label: "Tên chung cư/dự án",
    type: INPUT,
    placeholder: "Nhập",
    css: css,
    labelCol: cssLabel,
    wrapperCol: cssInput,
    value: "HT nhập và cho sửa",
  },
  {
    key: 3,
    label: "Số tầng toà nhà",
    require: true,
    type: SELECT,
    placeholder: "Nhập",
    css: css,
    labelCol: cssLabel,
    wrapperCol: cssInput,
    value: "HT nhập và cho sửa",
  },
  {
    key: 4,
    label: "Số hầm toà nhà",
    type: INPUT,
    placeholder: "Nhập",
    css: css,
    labelCol: cssLabel,
    wrapperCol: cssInput,
    value: "HT nhập và cho sửa",
  },
];
