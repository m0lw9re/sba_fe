import { memo, useState } from "react";
import { randomId } from "utils";
import "./style.scss";
import { UploadFile } from "constant/types";
import { DynamicTable } from "components/DynamicTable";
import { ColumnsType } from "antd/es/table";
import InputCustom from "components/InputCustom";

const ModalCreateEditTable = () => {
  const [listUpload, setListUpload] = useState<Array<UploadFile>>([]);

  // useEffect(() => {
  //   if (listUpload) {
  //     setListUpload(listUpload.map((item) => ({ ...item, key: randomId() })));
  //   }
  // }, [listUpload]);

  const handleAddRow = () => {
    const newItem: UploadFile = {
      key: randomId(),
      attachments: "",
      descriptions: "",
    };
    setListUpload((prev) => [...prev, newItem]);
  };

  const handleRemoveRow = (record: any) => {
    const tmpArr = [...listUpload];
    const foundIndex = tmpArr.findIndex((el) => el.key === record.key);

    if (foundIndex === -1) return;

    tmpArr.splice(foundIndex, 1);
    setListUpload([...tmpArr]);
  };

  const handleChangeRow = (key: string, data: any) => {
    const tmpArr = [...listUpload];
    const foundIndex = tmpArr.findIndex((el) => el.key === key);
    if (foundIndex === -1) return;

    tmpArr[foundIndex] = { ...tmpArr[foundIndex], ...data };
    setListUpload([...tmpArr]);
  };

  const handleFileUpload = (key: string, file: File) => {
    // Handle the file upload action here, e.g., store the file in the `UploadFile` object.
    // You can use a state or context for managing the uploaded files.
    // Example: tmpArr[foundIndex] = { ...tmpArr[foundIndex], attachments: file };
    // Make sure to handle file upload validation and storage appropriately.
  };

  const columns: ColumnsType<UploadFile> = [
    {
      key: 1,
      title: "STT",
      dataIndex: "index",
      align: "center",
      render: (text, record, rowIndex) => rowIndex + 1,
    },
    {
      key: 2,
      title: "Tài liệu đính kèm",
      render: (text, record) => (
        <input
          type="file"
          onChange={(e: any) =>
            handleFileUpload(record.key || "", e.target.files[0])
          }
        />
      ),
    },
    {
      key: 4,
      title: "Mô tả",
      dataIndex: "descriptions",
      align: "center",
      render: (descriptions, record) => {
        return (
          <InputCustom
            value={descriptions || ""}
            onChange={(e) =>
              handleChangeRow(record.key || "", {
                descriptions: e.target.value,
              })
            }
          />
        );
      },
    },
  ];

  return (
    <DynamicTable
      columns={columns}
      dataSource={listUpload}
      onAddRow={handleAddRow}
      onRemoveRow={(record) => handleRemoveRow(record)}
    />
  );
};

export default memo(ModalCreateEditTable);
