import { Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { AssetListApprovalWaitingType } from "constant/types";
import { numberUtils } from "utils";

const defaulColumns: ColumnsType<AssetListApprovalWaitingType> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: "50px",
    fixed: "left",
  },
  {
    key: 2,
    title: "Mã tài sản",
    dataIndex: "assetCode",
    align: "left",
    sorter: true,
    fixed: "left",
    width: "190px",
  },
  {
    key: 3,
    title: "Mã CLIMS",
    dataIndex: "climsCode",
    align: "left",
    width: "190px",
  },
  {
    key: 4,
    title: "Phân loại",
    dataIndex: "storedType",
    align: "left",
    width: "150px",
  },
  {
    key: 5,
    title: "Địa chỉ thực tế",
    dataIndex: "address",
    align: "left",
    width: "420px",
  },
  // {
  //   key: 7,
  //   title: "Lộ giới giao thông",
  //   dataIndex: "roadContiguousTypeName",
  //   align: "left",
  // },
  {
    key: 6,
    title: "Mục đích sử dụng đất",
    dataIndex: "usingPurposeName",
    align: "left",
    width: "150px",
  },
  {
    key: 7,
    title: "Diện tích (m²)",
    dataIndex: "areaWidth",
    render: (areaWidth) => (
      <>{areaWidth ? numberUtils.formatNumber(areaWidth) : ""}</>
    ),
    align: "left",
    sorter: true,
  },
  {
    key: 8,
    title: "Giá rao bán (đồng)",
    dataIndex: "estimatePrice",
    align: "right",
    sorter: true,
    render: (estimatePrice) => (
      <>{estimatePrice ? numberUtils.formatNumber(estimatePrice) : ""}</>
    ),
    width: "150px",
  },
  {
    key: 9,
    title: "Người tạo",
    dataIndex: "whoCreate",
    align: "left",
    render: (text) => (
      <Tooltip title={text}>
        <div className="inline-text">{text}</div>
      </Tooltip>
    ),
    width: "150px",
  },
  {
    key: 10,
    title: "Trạng thái",
    dataIndex: "transactionStatus",
    align: "left",
  },
  {
    key: 11,
    title: "Nguồn thông tin",
    dataIndex: "infoSourceName",
    align: "left",
  },
  {
    key: "actions",
    align: "center",
    title: "Hành động",
    fixed: "right",
    width: "100px",
  },
];

const defaulColumnsApartment: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    render: (text, record, rowIndex) => rowIndex + 1,
    align: "center",
    width: "50px",
    fixed: "left",
  },
  {
    key: 2,
    title: "Mã tài sản",
    dataIndex: "assetCode",
    align: "left",
    sorter: true,
    fixed: "left",
    width: "190px",
  },
  {
    key: 3,
    title: "Mã CLIMS",
    dataIndex: "climsCode",
    align: "left",
    width: "190px",
  },
  {
    key: 4,
    title: "Phân loại",
    dataIndex: "storedType",
    align: "left",
    width: "150px",
  },
  {
    key: 5,
    title: "Địa chỉ thực tế",
    dataIndex: "address",
    align: "left",
    width: "420px",
  },
  {
    key: 8,
    title: "Diện tích thông thuỷ (m²)",
    dataIndex: "clearanceArea",
    align: "right",
    width: "100px",
  },
  {
    key: 9,
    title: "Diện tích sử dụng (m²)",
    dataIndex: "privateUseArea",
    align: "right",
    width: "100px",
  },
  {
    key: 10,
    title: "Giá rao bán",
    dataIndex: "estimatePrice",
    align: "right",
    render: (estimatePrice) => (
      <>{estimatePrice ? numberUtils.formatNumber(estimatePrice) : ""}</>
    ),
    width: "130px",
  },
  {
    key: 11,
    title: "Người tạo",
    dataIndex: "whoCreate",
    align: "left",
    width: "150px",
  },
  {
    key: 13,
    title: "Trạng thái",
    dataIndex: "transactionStatus",
    align: "center",
    width: "150px",
  },
  {
    key: 14,
    title: "Nguồn thông tin",
    dataIndex: "infoSourceName",
    align: "center",
    width: "150px",
  },
  {
    key: "actions",
    align: "center",
    title: "Hành động",
    width: "150px",
    fixed: "right",
  },
];
const defaultColumnsMoveableAsset: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: "50px",
    fixed: "left",
  },
  {
    key: 2,
    title: "Mã tài sản",
    dataIndex: "assetCode",
    align: "left",
    width: "190px",
    fixed: "left",
  },
  // {
  //   key: 3,
  //   title: "Mã CLIMS",
  //   dataIndex: "climsCode",
  //   align: "left",
  //   width: "190px",
  // },
  {
    key: 4,
    title: "Phân loại tài sản",
    dataIndex: "assetLevelThreeName",
    align: "left",
    width: "150px",
  },
  {
    key: 5,
    title: "Địa chỉ thực tế",
    dataIndex: "address",
    align: "left",
    width: "420px",
  },
  {
    key: 4,
    title: "Tên tài sản",
    dataIndex: "name",
    align: "left",
    width: "150px",
  },
  {
    key: 10,
    title: "Giá rao bán (đồng)",
    dataIndex: "estimatePrice",
    align: "right",
    render: (estimatePrice) => (
      <>{estimatePrice ? numberUtils.formatNumber(estimatePrice) : ""}</>
    ),
    width: "130px",
  },
  {
    key: 10.5,
    title: "Giá ước lượng (đồng)",
    dataIndex: "transactionPrice",
    align: "right",
    render: (transactionPrice) => (
      <>{transactionPrice ? numberUtils.formatNumber(transactionPrice) : ""}</>
    ),
    width: "130px",
  },
  {
    key: 11,
    title: "Người tạo",
    dataIndex: "whoCreate",
    align: "left",
    width: "150px",
  },
  {
    key: 14,
    title: "Nguồn thông tin",
    dataIndex: "infoSourceName",
    align: "center",
    width: "150px",
  },
  {
    key: "actions",
    align: "center",
    title: "Hành động",
    width: "150px",
    fixed: "right",
  },
];
const defaulColumnsVehicle: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: "50px",
    fixed: "left",
  },
  {
    key: 2,
    title: "Mã tài sản",
    dataIndex: "assetCode",
    align: "left",
    width: "190px",
    fixed: "left",
  },
  {
    key: 3,
    title: "Mã CLIMS",
    dataIndex: "climsCode",
    align: "left",
    width: "190px",
  },
  {
    key: 4,
    title: "Phân loại",
    dataIndex: "storedType",
    align: "left",
    width: "150px",
  },
  {
    key: 4,
    title: "Nhãn hiệu",
    dataIndex: "vehicleBrand",
    align: "center",
    width: "120px",
  },
  {
    key: 7,
    title: "Số loại/Model",
    dataIndex: "vehicleModel",
    align: "center",
    width: "120px",
  },
  {
    key: 8,
    title: "Động cơ (kW)",
    dataIndex: "maxOutputRpm",
    align: "center",
    width: "120px",
  },
  {
    key: 9,
    title: "Số KM đã qua sử dụng",
    dataIndex: "odo",
    align: "center",
    width: "120px",
  },
  {
    key: 10,
    title: "Giá rao bán",
    dataIndex: "estimatePrice",
    align: "right",
    render: (estimatePrice) => (
      <>{estimatePrice ? numberUtils.formatNumber(estimatePrice) : ""}</>
    ),
    width: "130px",
  },
  {
    key: 11,
    title: "Người tạo",
    dataIndex: "whoCreate",
    align: "left",
    width: "150px",
  },
  {
    key: 13,
    title: "Trạng thái",
    dataIndex: "transactionStatus",
    align: "center",
    width: "150px",
  },
  {
    key: 14,
    title: "Nguồn thông tin",
    dataIndex: "infoSourceName",
    align: "center",
    width: "150px",
  },
  {
    key: "actions",
    align: "center",
    title: "Hành động",
    width: "150px",
    fixed: "right",
  },
];

const defaulColumnsWaterVehicle: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: "50px",
    fixed: "left",
  },
  {
    key: 2,
    title: "Mã tài sản",
    dataIndex: "assetCode",
    align: "left",
    width: "190px",
    fixed: "left",
  },
  {
    key: 3,
    title: "Mã CLIMS",
    dataIndex: "climsCode",
    align: "left",
    width: "190px",
  },
  {
    key: 4,
    title: "Phân loại",
    dataIndex: "storedType",
    align: "left",
    width: "150px",
  },
  {
    key: 5,
    title: "Tên tàu",
    dataIndex: "name",
    align: "left",
    width: "150px",
  },
  {
    key: 6,
    title: "Nhãn hiệu",
    dataIndex: "shipbuildingBrand",
    align: "left",
    width: "150px",
  },
  {
    key: 7,
    title: "Động cơ (kW)",
    dataIndex: "machinePower",
    align: "center",
    width: "100px",
  },
  {
    key: 8,
    title: "Giá thương lượng",
    dataIndex: "transactionPrice",
    align: "right",
    render: (transactionPrice) => (
      <>{transactionPrice ? numberUtils.formatNumber(transactionPrice) : ""}</>
    ),
    width: "130px",
  },
  {
    key: 9,
    title: "Người tạo",
    dataIndex: "whoCreate",
    align: "left",
    width: "150px",
  },
  {
    key: 10,
    title: "Trạng thái",
    dataIndex: "transactionStatus",
    align: "center",
    width: "150px",
  },
  {
    key: 11,
    title: "Nguồn thông tin",
    dataIndex: "infoSourceName",
    align: "center",
    width: "150px",
  },
  {
    key: "actions",
    align: "center",
    title: "Hành động",
    fixed: "right",
    width: "100px",
  },
];

const defaulColumnsDevice: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: "50px",
    fixed: "left",
  },
  {
    key: 2,
    title: "Mã tài sản",
    dataIndex: "assetCode",
    align: "left",
    width: "190px",
    fixed: "left",
  },
  {
    key: 3,
    title: "Mã CLIMS",
    dataIndex: "climsCode",
    align: "left",
    width: "190px",
  },
  {
    key: 4,
    title: "Phân loại",
    dataIndex: "storedType",
    align: "left",
    width: "150px",
  },
  {
    key: 4,
    title: "Tên MMTB",
    dataIndex: "name",
    align: "left",
    width: "150px",
  },
  {
    key: 4,
    title: "Nhãn hiệu",
    dataIndex: "vehicleBrand",
    align: "center",
    width: "120px",
  },
  {
    key: 7,
    title: "Số loại/Model",
    dataIndex: "vehicleModel",
    align: "center",
    width: "120px",
  },
  {
    key: 8,
    title: "Động cơ (kW)",
    dataIndex: "maxOutputRpm",
    align: "center",
    width: "120px",
  },
  {
    key: 9,
    title: "Chất lượng còn lại",
    dataIndex: "remainQuality",
    align: "left",
    width: "150px",
  },
  {
    key: 8,
    title: "Giá rao bán",
    dataIndex: "transactionPrice",
    align: "right",
    render: (estimatePrice) => (
      <>{estimatePrice ? numberUtils.formatNumber(estimatePrice) : ""}</>
    ),
    width: "130px",
  },
  {
    key: 9,
    title: "Người tạo",
    dataIndex: "whoCreate",
    align: "left",
    width: "150px",
  },
  {
    key: 10,
    title: "Trạng thái",
    dataIndex: "transactionStatus",
    align: "center",
    width: "150px",
  },
  {
    key: 11,
    title: "Nguồn thông tin",
    dataIndex: "infoSourceName",
    align: "center",
    width: "150px",
  },
  {
    key: "actions",
    align: "center",
    title: "Hành động",
    fixed: "right",
    width: "100px",
  },
];

const mockData: Array<AssetListApprovalWaitingType> = [];

for (let i = 0; i <= 10; i++) {
  const item: AssetListApprovalWaitingType = {
    key: i + 1,
    storeCode: "23.000308.SBA",
    climsCode: "91829182.STC",
    categoryType: "TSTĐ",
    realAddress: "Xã Đông Hưng A, Hu...",
    trafficLine: "VT4",
    purposeLandUsage: "Đất ở",
    area: 82.2,
    singlePrice: 39000000,
    creater: "Nguyễn Văn B",
    status: "Chờ phê duyệt",
    sourceInfor: "-",
  };
  mockData.push(item);
}

export {
  defaulColumns,
  defaulColumnsApartment,
  mockData,
  defaulColumnsVehicle,
  defaulColumnsDevice,
  defaulColumnsWaterVehicle,
  defaultColumnsMoveableAsset,
};
