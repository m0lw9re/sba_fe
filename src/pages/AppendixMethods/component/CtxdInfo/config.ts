import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";

export interface ResultData {
  code: string;
  constructionType: string;
  constructionName: string;
  unitPrice: string;
  clcl: string;
  mdht: string;
  value: string;
  note: string;
}

export const mockData: Array<ResultData> = [
  {
    code: "CT1",
    constructionType: "-",
    constructionName: "-",
    unitPrice: "-",
    clcl: "-",
    mdht: "-",
    value: "-",
    note: "-",
  },
  {
    code: "CT2",
    constructionType: "-",
    constructionName: "-",
    unitPrice: "-",
    clcl: "-",
    mdht: "-",
    value: "-",
    note: "-",
  },
];

export const defaultColumns2: ColumnsEdit = [
  {
    key: 1,
    disable: true,
    title: "Mã",
    dataIndex: "code",
    width: "5.2%",
    align: "center",
  },
  {
    key: 2,
    disable: true,
    align: "center",
    title: "Loại công trình xây dựng",
    dataIndex: "constructionType",
    width: "11.85%",
  },
  {
    key: 3,
    disable: true,
    align: "center",
    title: "Mô tả đặc tính kỹ thuật",
    dataIndex: "constructionName",
    width: "11.85%",
  },
  {
    key: 4,
    disable: true,
    title: "Diện tích sử dụng (m²)",
    dataIndex: "area",
    width: "11.85%",
    align: "center",
  },
  {
    key: 5,
    disable: true,
    title: "Đơn giá(đồng/m2 hoặc đồng/m3)",
    dataIndex: "unitPrice",
    width: "11.85%",
    align: "center",
  },
  {
    key: 6,
    disable: true,
    title: "CLCL (%)",
    dataIndex: "clcl",
    width: "11.85%",
    align: "center",
  },
  {
    key: 7,
    disable: true,
    title: "MĐHT (%)",
    dataIndex: "mdht",
    width: "11.85%",
    align: "center",
  },
  {
    key: 8,
    disable: true,
    title: "Giá trị(đồng)",
    dataIndex: "value",
    width: "11.85%",
    align: "center",
  },
  {
    key: 9,
    disable: true,
    title: "Mô tả khác",
    dataIndex: "note",
    width: "11.85%",
    align: "center",
  },
];
