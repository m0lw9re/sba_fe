import type { ColumnsType } from "antd/es/table";

type MovableTableType = {
  key?: number;
  waterwayVehiclesName?: string | null;
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
    title: "Phương tiện đường thuỷ",
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

const mockData: Array<MovableTableType> = [];

for (let i = 0; i < 20; i++) {
  const item: MovableTableType = {
    key: i,
    waterwayVehiclesName: "Tàu biển",
  };
  mockData.push(item);
}

export { mockData, defaultColumns };
export type { MovableTableType };
