import FormItem from "components/InputFields/FormItem";
import renderRequired from "components/RenderRequire";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";
import { numberUtils } from "utils";

const defaultColumns: ColumnsEdit = [
  {
    key: 1,
    title: "STT",
    dataIndex: "",
    align: "center",
    width: "4%",
    editable: false,
    render: (_, record, index) => {
      return index + 1;
    },
  },
  {
    key: 2,
    title: renderRequired("Tên tài sản"),
    dataIndex: "name",
    editable: true,
    align: "center",
    width: "25%",
  },
  {
    key: 3,
    title: renderRequired("Diện tích (m²)"),
    dataIndex: "totalArea",
    editableNumber: true,
    width: "15%",
  },
  {
    key: 4,
    title: renderRequired("Đơn giá (đồng/m²)"),
    dataIndex: "unitPrice",
    editableNumber: true,
    width: "20%",
  },
  {
    key: 5,
    title: "Giá trị (đồng)",
    dataIndex: "totalValue",
    editableNumber: true,
    disable: true,
    width: "20%",
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

const defaultColumnsValuationResult: ColumnsEdit = [
  {
    key: 1,
    title: "STT",
    dataIndex: "",
    align: "center",
    width: "4%",
    editable: false,
    render: (_, record, index) => {
      return index + 1;
    },
  },
  {
    key: 2,
    title: renderRequired("Tên tài sản"),
    dataIndex: "name",
    editable: true,
    align: "center",
    width: "25%",
  },
  {
    key: 3,
    title: "Diện tích (m²)",
    dataIndex: "totalArea",
    editableNumber: true,
    width: "15%",
  },
  {
    key: 4,
    title: "Đơn giá (đồng/m²)",
    dataIndex: "unitPrice",
    editableNumber: true,
    width: "20%",
  },
  {
    key: 5,
    title: "Giá trị (đồng)",
    dataIndex: "totalValue",
    editableNumber: true,
    width: "20%",
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

const renderTotalLandValues = (data: any) => {
  if (data.length === 0) return;
  let total = 0;
  data?.map((el: any) => (total += el));
  return `Tổng giá trị đất: ${numberUtils.formatNumber(
    numberUtils.roundDecimalNumber(total)!
  )}`;
};

export { defaultColumns, renderTotalLandValues, defaultColumnsValuationResult };
