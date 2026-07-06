import type { ColumnsType } from "antd/es/table";

type OthersTableType = {
  key?: number;
  mmtbName?: string | null;
};

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    width: "5%",
  },
  {
    key: 2,
    title: "Phân loại tài sản",
    dataIndex: "assetLevelThreeName",
    align: "left",
  },
  {
    key: 3,
    title: "Trạng thái",
    dataIndex: "status",
    align: "center",
    width: 180,
    render: (status) => (status === 1 ? "Hoạt động" : "Không hoạt động"),
  },
  {
    key: 4,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: 100,
  },
];

export { defaultColumns };
export type { OthersTableType };
