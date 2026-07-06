import { randomId } from "utils/string";
import { ColumnsEdit } from "components/TableInputAddCustom/TableInputAddCustom";

export type UploadFile = {
  key?: string;
  attachments: string;
  descriptions: string;
};

export const defaultColumns: ColumnsEdit = [
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
