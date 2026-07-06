import { ColumnsType } from "antd/es/table";
import { AddressAssetTableType } from "constant/types";

const defaultColumns: ColumnsType<AddressAssetTableType> = [
  {
    key: 1,
    title: "Tên tài sản",
    dataIndex: "name",
    width: '30%'
  },
  {
    key: 2,
    title: "Tỉnh/Thành phố",
    dataIndex: "provinceCode",
    width: '15%'
  },
  {
    key: 3,
    title: "Thành phố/Quận/Huyện/Thị xã",
    dataIndex: "districtCode",
    width: '15%'
  },
  {
    key: 4,
    title: "Xã/Phường/Thị trấn",
    dataIndex: "wardCode",
    width: '15%'
  },
  {
    key: 6,
    title: "Mô tả chi tiết địa chỉ",
    dataIndex: "addressDetail",
    width: '25%'
  },
];

export { defaultColumns };
