import { ColumnsType } from "antd/es/table";
import { RepairHistoryType } from "constant/types";
import { formatDate } from "utils";

const RepairStatusOptions = [
  {
    value: 1,
    label: "Chờ thực hiện",
  },
  {
    value: 2,
    label: "Đang thực hiện",
  },
  {
    value: 3,
    label: "Đã thực hiện",
  },
];

const defaultColumns: ColumnsType<RepairHistoryType> = [
  {
    key: 0,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: "5%",
    render: (key, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 1,
    title: "Mô tả",
    dataIndex: "note",
    align: "left",
    width: "20%",
  },
  {
    key: 2,
    title: "Trạng thái thực hiện",
    dataIndex: "repairStatusId",
    render: (repairStatusId) => {
      const foundIndex = RepairStatusOptions.findIndex(
        (el) => el.value === repairStatusId
      );
      if (foundIndex === -1) return <></>;
      const labelRender = RepairStatusOptions[foundIndex].label;
      return <>{labelRender}</>;
    },
    width: "20%",
  },
  {
    key: 3,
    title: "Giấy tờ liên quan",
    dataIndex: "filename",
    align: "left",
    width: "15%",
  },
  {
    key: 4,
    title: "Ngày thực hiện sửa chữa",
    dataIndex: "dateRepair",
    align: "left",
    render: (dateRepair: string) => (
      <>{dateRepair ? formatDate(dateRepair) : null}</>
    ),
    width: "15%",
  },
  {
    key: 5,
    title: "Người thực hiện",
    dataIndex: "whoUpload",
    align: "left",
    width: "15%",
  },
  {
    key: "action",
    align: "center",
  },
];

export { RepairStatusOptions, defaultColumns };
