import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";

export type UploadFile = {
  key?: string;
  attachments: string;
  descriptions: string;
};

export const defaultColumns: ColumnsEdit = [
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
    title: "Tài liệu đính kèm",
    dataIndex: "attachments",
  },
  {
    key: 4,
    title: "Mô tả",
    dataIndex: "descriptions",
    align: "center",
    editable: true,
  },
];
