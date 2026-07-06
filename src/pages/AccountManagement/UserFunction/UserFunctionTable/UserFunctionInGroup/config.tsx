import { ColumnsType } from "antd/es/table";

type FunctionTableType = {
  key?: React.Key;
  functionCode: number | null;
  functionName: string | null;
  children?: Array<FunctionTableType>;
};

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    dataIndex: "functionCode",
    title: "Mã chức năng",
  },
  {
    key: 2,
    dataIndex: "functionName",
    title: "Tên chức năng",
  },
];

export { defaultColumns };
export type { FunctionTableType };
