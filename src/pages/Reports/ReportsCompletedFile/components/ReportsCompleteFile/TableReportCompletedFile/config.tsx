import { ColumnsType } from "antd/es/table";

type DeafaultTable = {
  key?: number;
  name?: string;
  totalCount?: number;
  income?: number;
  outcome?: number;
  children?: DeafaultTable[];
};

const defaultColumns: ColumnsType<DeafaultTable> = [
  {
    key: 1,
    title: "Khu vực",
    dataIndex: "name",
    align: "left",
  },
  {
    key: 2,
    title: "Số hồ sơ hoàn thành",
    dataIndex: "totalCount",
    align: "center",
  },
  {
    key: 3,
    title: "Hồ sơ đạt tiến độ",
    dataIndex: "income",
    align: "center",
  },
  {
    key: 4,
    title: "Hồ sơ không đạt tiến độ",
    dataIndex: "outcome",
    align: "center",
  },
];

export { defaultColumns }
