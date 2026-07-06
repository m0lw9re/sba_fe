import { ColumnsType } from "antd/es/table";
import { formatDate } from "utils/date";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 2,
    title: "Mã  hồ sơ ",
    dataIndex: "assetCode",
  },
  {
    key: 3,
    title: "CBQL",
    dataIndex: "whoCreate",
  },
  {
    key: 4,
    title: "Ngày lập",
    dataIndex: "dateCreate",
    render: (dateCreate) => {
      if (dateCreate) {
        return <>{formatDate(dateCreate)}</>;
      }
    },
  },
  {
    key: 5,
    title: "Khách hàng",
    dataIndex: "customerName",
  },
  {
    key: 6,
    title: "Loại KH",
    dataIndex: "customerTypeName",
    align: "center",
  },
  {
    key: 7,
    title: "Tài sản",
    dataIndex: "assetLevelTwoName",
  },
  {
    key: 8,
    title: "Giá trị tài sản",
    dataIndex: "totalPrice",
    align: "right",
  },
  {
    key: 9,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
  },
];

export { defaultColumns };
