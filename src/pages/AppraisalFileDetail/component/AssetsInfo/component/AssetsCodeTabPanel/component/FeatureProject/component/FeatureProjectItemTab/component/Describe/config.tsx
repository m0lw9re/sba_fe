import renderRequired from "components/RenderRequire";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";

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
    title: renderRequired("Tên hạng mục"),
    dataIndex: "categoryName",
    // className: widthSizeColumnClassNameInput,
    editable: true,
    popupInput: true,
    maxLength: 2000,
    // width: "100px",
  },
  {
    key: 3,
    title: renderRequired("Đặc điểm kinh tế - kỹ thuật"),
    dataIndex: "feature",
    // className: widthSizeColumnClassNameInput,
    editable: true,
    popupInput: true,
    maxLength: 2000,
  },
  {
    key: 4,
    title: renderRequired("Diện tích sử dụng (m²)"),
    editable: true,
    // className: widthSizeColumnClassNameInput,
    formatterNumber: formatValue,
    dataIndex: "area",
  },

  {
    title: "",
    dataIndex: "action",
    key: "action",
    align: "center",
    fixed: "right",
    // className: backgroundAction,
    width: 80,
  },
];

export { defaultColumns };
