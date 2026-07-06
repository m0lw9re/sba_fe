import StatusWorking from "components/StatusWorking";
import { ColumnsType } from "antd/es/table";

export type DataItem = {
  key: number;
  code: string;
  type: string;
  author: string;
  paperNumber: number;
  tranhChap: boolean;
  status: number;
};

const itemsTableAssets: Array<DataItem> = [
  {
    key: 1,
    code: "9182",
    type: "Bất động sản",
    author: "Nguyễn Văn A",
    paperNumber: 32,
    tranhChap: true,
    status: 1,
  },
  {
    key: 2,
    code: "9182",
    type: "Bất động sản",
    author: "Nguyễn Văn A",
    paperNumber: 32,
    tranhChap: true,
    status: 1,
  },
  {
    key: 3,
    code: "9182",
    type: "Bất động sản",
    author: "Nguyễn Văn A",
    paperNumber: 32,
    tranhChap: true,
    status: 0,
  },
  {
    key: 4,
    code: "9182",
    type: "Bất động sản",
    author: "Nguyễn Văn A",
    paperNumber: 32,
    tranhChap: true,
    status: 0,
  },
  {
    key: 5,
    code: "9182",
    type: "Bất động sản",
    author: "Nguyễn Văn A",
    paperNumber: 32,
    tranhChap: true,
    status: 1,
  },
  {
    key: 6,
    code: "9182",
    type: "Bất động sản",
    author: "Nguyễn Văn A",
    paperNumber: 32,
    tranhChap: true,
    status: 0,
  },
  {
    key: 7,
    code: "9182",
    type: "Bất động sản",
    author: "Nguyễn Văn A",
    paperNumber: 32,
    tranhChap: true,
    status: 1,
  },
];

const columnsTableAssets: ColumnsType<any> = [
  {
    key: 8,
    title: "Mã TS",
    dataIndex: "code",
  },
  {
    key: 9,
    title: "Loại tài sản",
    dataIndex: "type",
  },
  {
    key: 10,
    title: "Chủ sở hữu",
    dataIndex: "author",
  },
  {
    key: 11,
    title: "Giấy tờ pháp lý",
    dataIndex: "paperNumber",
    align: "right",
  },
  {
    key: 12,
    title: "Tranh chấp",
    dataIndex: "tranhChap",
    render: (tranhChap) => (tranhChap ? <>Có</> : <>Không</>),
  },
  {
    key: 13,
    title: "Status",
    dataIndex: "status",
    align: 'center',
    render: (status) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <StatusWorking status={status} />
      </div>
    ),
  },
];

export { itemsTableAssets, columnsTableAssets };
