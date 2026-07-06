import type { ColumnsType } from "antd/es/table";

type DeafaultTable = {
  key?: number;
  numberCommitDate?: number;
  assetLevelTwoId?: string;
  area?: string;
};

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    width: "50px"
  },
  {
    key: 2,
    title: "Số ngày cam kết",
    dataIndex: "date",
    width: "146px",
    align: "center"
  },
  {
    key: 3,
    title: "Loại hình tài sản",
    dataIndex: ["assetType", "name"],
    align: "left"
  },
  {
    key: 4,
    title: "Địa bàn",
    dataIndex: ["area", "name"],
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: "128px"
  },
];

const mockData: Array<DeafaultTable> = [];

for (let i = 0; i < 10; i++) {
  const item: DeafaultTable = {
    key: i,
    numberCommitDate: 2,
    assetLevelTwoId: "Căn hộ chung cư",
    area: "Nội thành",
  };
  mockData.push(item);
}

export { defaultColumns, mockData };
