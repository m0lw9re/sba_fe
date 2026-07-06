import { memo, useEffect, useState } from "react";
import { randomId } from "utils";
import "./style.scss";
import { UploadFile } from "constant/types";
import { DynamicTable } from "components/DynamicTable";
import { defaultColumns } from "./config";
import Table, { ColumnsType } from "antd/es/table";
import InputCustom from "components/InputCustom";
import TableCustom from "components/TableCustom";

const ModalViewTable = () => {
  const [listUpload, setListUpload] = useState<Array<UploadFile>>([]);

  const defaultColumns: ColumnsType<UploadFile> = [
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
    },
  ];

  const data = [
    {
      attachments: "PT/00001",
      descriptions: "Mô tả",
    },
    {
      attachments: "PT/00001",
      descriptions: "Mô tả",
    },
  ];

  const dataTable = data
    ? data.map((item: any) => {
        return {
          ...item,
          key: randomId(),
        };
      })
    : [];

  return (
    <Table
      size="small"
      dataSource={dataTable}
      columns={defaultColumns}
      bordered={true}
      pagination={false}
    />
  );
};

export default ModalViewTable;
