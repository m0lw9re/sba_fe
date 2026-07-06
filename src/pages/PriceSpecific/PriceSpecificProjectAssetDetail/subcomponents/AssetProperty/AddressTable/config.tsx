import { ColumnsType } from "antd/es/table";
import { AddressAssetTableType } from "constant/types";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<AddressAssetTableType> = [
  {
    key: 1,
    title: "Tỉnh/Thành phố",
    dataIndex: "provinceName",
    width: "15%",
  },
  {
    key: 2,
    title: "Thành phố/Quận/Huyện/Thị xã",
    dataIndex: "districtName",
    width: "15%",
  },
  {
    key: 3,
    title: "Xã/Phường/Thị trấn",
    dataIndex: "wardName",
    width: "15%",
  },
  {
    key: 4,
    title: "Địa điểm thẩm định giá",
    dataIndex: "appraisalLocation",
    width: "15%",
    render: (appraisalLocation) =>
      appraisalLocation ? appraisalLocation : "-",
  },
  // Đợi xác định trường
  {
    key: 5,
    title: "Hiện trạng",
    dataIndex: "currentAsset",
    width: "15%",
    render: (currentAsset) => (currentAsset ? currentAsset : "-"),
  },
  {
    key: 6,
    title: "Diện tích khuôn viên (m²)",
    dataIndex: "areaWidth",
    width: "15%",
    render: (areaWidth) =>
      areaWidth ? numberUtils.formatNumber(areaWidth) : "-",
  },
  {
    key: 7,
    title: "Mô tả vị trí địa lý",
    dataIndex: "description",
    width: "15%",
    render: (description) => (description ? description : "-"),
  },
];

export { defaultColumns };
