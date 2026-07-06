import { ColumnsType } from "antd/es/table";
import { AddressAssetTableType } from "constant/types";

const defaultColumns: ColumnsType<AddressAssetTableType> = [
  {
    key: 1,
    title: "Tỉnh/Thành phố",
    dataIndex: "provinceCode",
    width: '15%'
  },
  {
    key: 2,
    title: "Thành phố/Quận/Huyện/Thị xã",
    dataIndex: "districtCode",
    width: '15%'
  },
  {
    key: 3,
    title: "Xã/Phường/Thị trấn",
    dataIndex: "wardCode",
    width: '15%'
  },
  {
    key: 4,
    title: "Đường phố",
    dataIndex: "streetCode",
    width: '15%'
  },
  {
    key: 6,
    title: "Chi tiết",
    dataIndex: "detail",
    width: '25%'
  },
];

export { defaultColumns };