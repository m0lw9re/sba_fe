import { ColumnsType } from "antd/es/table";
import { AddressAssetTableType } from "constant/types";

const defaultColumns: ColumnsType<AddressAssetTableType> = [
  {
    key: 1,
    title: "Tỉnh/Thành phố",
    dataIndex: "provinceCode",
  },
  {
    key: 2,
    title: "Thành phố/Quận/Huyện/Thị xã",
    dataIndex: "districtCode",
  },
  {
    key: 3,
    title: "Xã/Phường/Thị trấn",
    dataIndex: "wardCode",
  },
  {
    key: 4,
    title: "Đường phố",
    dataIndex: "streetCode",
  },
  {
    key: 5,
    title: "Đoạn đường/phố",
    dataIndex: "subStreetCode",
  },
  {
    key: 6,
    title: "Chi tiết",
    dataIndex: "detail",
  },
];

const mockData: Array<AddressAssetTableType> = [
  {
    key: 1,
    detail: "-",
    districtCode: "-",
    provinceCode: "-",
    streetCode: "-",
    subStreetCode: "-",
    wardCode: "-",
  },
];

export { defaultColumns, mockData };
