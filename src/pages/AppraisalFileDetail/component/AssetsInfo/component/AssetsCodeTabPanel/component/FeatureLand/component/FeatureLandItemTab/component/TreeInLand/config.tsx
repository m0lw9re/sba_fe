import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { randomId } from "utils/string";

const formatValue = (value?: string | number) => {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = value.toString();
  const [integerPart, decimalPart] = stringValue.split(".");
  if (decimalPart?.length > 3)
    return parseFloat(stringValue).toFixed(3).toString();
  return stringValue;
};

export type Tree = {
  key?: string;
  code: string;
  typeTree: number;
  detailTree: string;
  yearOld: string;
  density: string;
  area: string;
  loseRate: string;
  amountTree: string;
};

const widthSizeColumnClassNameSelect = "width-size-select";
const widthSizeColumnClassNameInput = "width-size-input";

export const defaultColumns: ColumnsEdit = [
  {
    key: 1,
    title: "STT",
    dataIndex: "",
    width: "50px",
    editable: false,
    align: "center",
    render: (_, record, index) => {
      return index + 1;
    },
  },
  {
    key: 2,
    title: "Loại cây trồng",
    dataIndex: "treeTypeId",
    align: "center",
    width: "250px",
    className: widthSizeColumnClassNameSelect,
    selected: true,
    showSearch: true,
  },
  {
    key: 3,
    title: "Chi tiết cây trồng",
    dataIndex: "treeDetail",
    className: widthSizeColumnClassNameInput,
    width: "250px",
    editable: true,
  },
  {
    key: 4,
    title: "Năm tuổi",
    editableNumber: true,
    className: widthSizeColumnClassNameInput,
    minNumber: 0,
    maxNumber: 9999,
    dataIndex: "yearOld",
    width: "13%",
  },
  {
    key: 5,
    title: "Mật độ (cây/ha)",
    formatterNumber: formatValue,
    className: widthSizeColumnClassNameInput,
    editableNumber: true,
    dataIndex: "density",
    width: "13%",
  },
  {
    key: 6,
    title: "Diện tích (m²)",
    formatterNumber: formatValue,
    className: widthSizeColumnClassNameInput,
    editableNumber: true,
    dataIndex: "area",
    width: "13%",
  },
  {
    key: 7,
    title: "Tỷ lệ hao hụt %",
    editableNumber: true,
    className: widthSizeColumnClassNameInput,
    minNumber: 0,
    maxNumber: 100,
    percentable: true,
    dataIndex: "lossRate",
    width: "13%",
  },
  {
    key: 8,
    title: "Số lượng cây",
    editableNumber: true,
    className: widthSizeColumnClassNameInput,
    minNumber: 0,
    dataIndex: "amount",
    width: "12%",
  },
  {
    title: "",
    dataIndex: "action",
    key: "action",
    align: "center",
    width: "5%",
    fixed: "right",
  },
];
