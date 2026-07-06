import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";

export interface ResultData {
  stt?: string;
  adjustContent: string;
  tstd: string;
  tsss1: string;
  tsss2: string;
  tsss3: string;
}
export interface SummaryData {
  stt?: string;
  totalPriceAdjust: string;
  priceChenhLech: string;
  priceDanChieu: string;
  priceThamDinh: string;
}

export const mockData: Array<ResultData> = [
  {
    adjustContent: "Đơn giá cuối cùng",
    tstd: "39,000,000",
    tsss1: "39,000,000",
    tsss2: "39,000,000",
    tsss3: "39,000,000",
  },
  {
    adjustContent: "Tỷ lệ điều chỉnh (%)",
    tstd: "-",
    tsss1: "0",
    tsss2: "0",
    tsss3: "0",
  },
  {
    adjustContent: "Diện tích (m2 )",
    tstd: "643",
    tsss1: "643",
    tsss2: "643",
    tsss3: "643",
  },
  {
    adjustContent: "Tỷ lệ điều chỉnh (%)",
    tstd: "-",
    tsss1: "0",
    tsss2: "0",
    tsss3: "0",
  },

  {
    adjustContent: "Diện tích (m2 )",
    tstd: "-",
    tsss1: "-",
    tsss2: "-",
    tsss3: "-",
  },
  {
    adjustContent: "Tỷ lệ điều chỉnh (%)",
    tstd: "-",
    tsss1: "0",
    tsss2: "0",
    tsss3: "0",
  },
];
export const summaryMockData: ResultData[] = [
  {
    stt: "",
    adjustContent: "Tổng tỷ lệ điều chỉnh (%)",
    tstd: "-",
    tsss1: "0",
    tsss2: "0",
    tsss3: "0",
  },
  {
    stt: "",
    adjustContent: "Mức giá chênh lệch (đồng/m²)",
    tstd: "-",
    tsss1: "0",
    tsss2: "0",
    tsss3: "0",
  },
  {
    stt: "",
    adjustContent: "Mức giá dẫn chiếu (đồng/m²)",
    tstd: "-",
    tsss1: "0",
    tsss2: "0",
    tsss3: "0",
  },
  {
    stt: "",
    adjustContent: "Đơn giá thẩm định (đồng/m²)",
    tstd: "0",
    tsss1: "0",
    tsss2: "0",
    tsss3: "0",
  },
];
export const defaultColumns2: ColumnsEdit = [
  {
    key: 1,
    disable: true,
    title: "STT",
    dataIndex: "stt",
    width: "5%",
    align: "center",
  },
  {
    key: 2,

    title: "Nội dung điều chỉnh",
    dataIndex: "adjustContent",
    // width: "18%",
    // selected: true,
  },
  {
    key: 3,
    //disable: true,
    title: "TSTĐ",
    dataIndex: "0",
    width: "18%",
    align: "center",
    editableNumber: true,
  },
  {
    key: 4,
    //disable: true,
    title: "TSSS 1",

    dataIndex: "1",
    width: "18%",
    align: "center",
    editableNumber: true,
  },
  // {
  //   key: 5,
  //   //disable: true,
  //   title: "TSSS 2",
  //   dataIndex: "tsss2",
  //   width: "18%",
  //   align: "center",
  //   editable: true,
  // },
  // {
  //   key: 5,
  //   disable: true,
  //   title: "TSSS 3",
  //   dataIndex: "tsss3",
  //   width: "18%",
  //   align: "center",
  //   editable: true,
  // },
  {
    key: "action",
    title: "",
    dataIndex: "action",
    width: "5%",
    align: "center",
  },
];
