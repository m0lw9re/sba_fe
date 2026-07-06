import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import renderRequired from "components/RenderRequire";

const formatValue = (value?: string | number) => {
  return value || value === 0
    ? `${value?.toString()}`
        .replace(/\.(?=\d{1,2}$)/, ",")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : "";
};

const widthSizeColumnClassNameSelect = "width-size-select";
const widthSizeColumnClassNameInput = "width-size-input";
const backgroundAction = "background-action";

const defaultColumns: ColumnsEdit = [
  {
    key: 1,
    title: "STT",
    dataIndex: "",
    align: "center",
    width: "50px  ",
    editable: false,
    render: (_, record, index) => {
      return index + 1;
    },
  },
  {
    key: 2,
    title: renderRequired("Loại công trình xây dựng"),
    dataIndex: "constructionTypeId",
    align: "center",
    width: "250px",
    className: widthSizeColumnClassNameSelect,
    selected: true,
    showSearch: true,
  },
  {
    key: 3,
    title: renderRequired("Mô tả đặc tính kỹ thuật"),
    dataIndex: "constructionNameId",
    align: "center",
    className: widthSizeColumnClassNameSelect,
    selected: true,
    showSearch: true,
    width: "250px",
  },
  {
    key: 4,
    title: renderRequired("Diện tích sử dụng (m²)"),
    editableNumber: true,
    className: widthSizeColumnClassNameInput,
    formatterNumber: formatValue,
    dataIndex: "constructionArea",
    width: "220px",
  },
  {
    key: 5,
    title: renderRequired("Hồ sơ pháp lý"),
    className: widthSizeColumnClassNameSelect,
    align: "center",
    selected: true,
    dataIndex: "constructionLegalTypeId",
    showSearch: true,
    width: "250px",
  },
  {
    key: 11,
    title: renderRequired("CLCL(%)"),
    editableNumber: true,
    className: widthSizeColumnClassNameInput,
    minNumber: 0,
    maxNumber: 100,
    dataIndex: "remainingQuality",
    width: "180px",
  },
  {
    key: 12,
    title: "MĐHT(%)",
    editableNumber: true,
    className: widthSizeColumnClassNameInput,
    minNumber: 0,
    maxNumber: 100,
    dataIndex: "mdht",
    width: "100px",
  },
  {
    key: 6,
    title: "Số tầng",
    className: widthSizeColumnClassNameInput,
    editableNumber: true,
    dataIndex: "floors",
    formatterNumber: formatValue,
    width: "100px",
  },
  {
    key: 7,
    title: "Số tầng hầm",
    className: widthSizeColumnClassNameInput,
    editableNumber: true,
    dataIndex: "baseFloors",
    formatterNumber: formatValue,
    width: "100px",
  },
  {
    key: 8,
    title: renderRequired("Nội thất"),
    className: widthSizeColumnClassNameInput,
    editable: true,
    popupInput: true,
    maxLength: 1000,
    dataIndex: "furnitures",
    width: "200px",
  },
  {
    key: 9,
    title: "Năm xây dựng",
    editable: true,
    className: widthSizeColumnClassNameInput,
    minNumber: 1900,
    maxNumber: 2023,
    dataIndex: "constructionYear",
    width: "100px",
  },
  {
    key: 10,
    title: "Năm sửa chữa",
    editable: true,
    className: widthSizeColumnClassNameInput,
    minNumber: 1900,
    maxNumber: 2024,
    dataIndex: "repairYear",
    width: "100px",
  },
  {
    key: 13,
    title: "Mô tả khác",
    className: widthSizeColumnClassNameInput,
    editable: true,
    popupInput: true,
    maxLength: 1000,
    dataIndex: "describe",
    width: "200px",
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    align: "center",
    fixed: "right",
    className: backgroundAction,
    width: "80px",
  },
];

const legalContructOptions = [
  {
    key: 1,
    value: 1,
    label: "Có giấy CN",
  },
  {
    key: 2,
    value: 2,
    label: "Chưa có giấy CN",
  },
];

export { defaultColumns, legalContructOptions };
