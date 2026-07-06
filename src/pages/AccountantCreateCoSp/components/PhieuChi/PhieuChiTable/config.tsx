import type { ColumnsType } from "antd/es/table";
import { formatDate } from "utils";

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
    title: "Số CT",
    dataIndex: "documentId",
  },
  {
    key: 3,
    title: "Ngày CT",
    dataIndex: "documentDate",
    // render: (value: string) => {
    //   return formatDate(value);
    // },
  },
  {
    key: 4,
    title: "Người lập",
    dataIndex: "staffName",
  },
  {
    key: 5,
    title: "Số BT",
    dataIndex: "btNumber",
  },
  {
    key: 6,
    title: "Trạng thái",
    dataIndex: "status",
  },
  {
    key: 7,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
    width: "5%",
  },
];

export { defaultColumns };
