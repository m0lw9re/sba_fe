import type { ColumnsType } from "antd/es/table";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    width: 60,
  },
  {
    key: 2,
    title: "Mã mục đích sử dụng đất",
    dataIndex: "usingPurposeCode",
    align: "left",
    width: 250,
  },
  {
    key: 3,
    title: "Mục đích sử dụng đất",
    dataIndex: "usingPurposeName",
    align: "left",
  },
  {
    key: 4,
    title: "Trong/ngoài KCN, CCN, KCX",
    dataIndex: "insideOutside",
    align: "center",
    render: (insideOutside: any) => {
      if (!insideOutside) return "Không";
      let str =
        insideOutside === 0
          ? "Không"
          : insideOutside === 1
          ? "Trong KCN, CCN, KCX"
          : "Ngoài KCN, CCN, KCX";
      return str;
    },
  },
  {
    key: 5,
    title: "Biểu phí áp dụng",
    dataIndex: "feeCode",
    width: "250px",
    align: "center",
    // render: (idFeeScheduleIdNew: any) => (idFeeScheduleIdNew === 1 ? "Biểu phí 1" : "Biểu phí 2"),
  },
  {
    key: 6,
    title: "Trạng thái",
    dataIndex: "status",
    render: (status: any) =>
      status === true ? "Hoạt động" : "Ngưng hoạt động",
    width: 150,
    align: "center",
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: 120,
  },
];

export { defaultColumns };
