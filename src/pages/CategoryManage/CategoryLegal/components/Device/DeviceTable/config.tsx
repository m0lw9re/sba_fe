import type { ColumnsType } from "antd/es/table";

type LegalDefaultTable = {
  key?: number;
  legalName: string;
  legalRequest: string;
};

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
    title: "Loại hồ sơ",
    dataIndex: "name",
    align: "left",
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: 120,
  },
];

const mockData: Array<LegalDefaultTable> = [];

for (let i = 0; i < 20; i++) {
  const item: LegalDefaultTable = {
    key: i,
    legalName: "Giấy chứng nhận quyền sử dụng đất",
    legalRequest: "Bắt buộc",
  };
  mockData.push(item);
}

export { mockData, defaultColumns };
export type { LegalDefaultTable };
