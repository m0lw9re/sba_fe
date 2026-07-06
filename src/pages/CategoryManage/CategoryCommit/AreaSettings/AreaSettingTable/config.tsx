import { ColumnsType } from "antd/es/table";

const areaSettingColumns: ColumnsType<any> = [
  {
    key: 1,
    dataIndex: "index",
    title: "STT",
    render: (text, record, rowIndex) => rowIndex + 1,
    width: "10%",
    align: "center",
  },
  {
    key: 2,
    dataIndex: "provinceName",
    title: "Tỉnh/Thành phố",
    width: "55%",
    align: "center",
  },
  {
    key: 3,
    dataIndex: "name",
    title: "Quận/Huyện",
    width: "35%",
    align: 'center'
  },
];

export { areaSettingColumns };
