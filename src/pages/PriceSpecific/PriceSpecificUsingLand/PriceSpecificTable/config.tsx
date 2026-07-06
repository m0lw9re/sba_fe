import { ColumnsType } from "antd/es/table";
import { numberUtils } from "utils";

const defaulColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: "75px",
    fixed: "left",
  },
  {
    key: 2,
    title: "Mã kho",
    dataIndex: "assetCode",
    align: "left",
    sorter: true,
    width: "250px",
    fixed: "left",
  },
  {
    key: 21,
    title: "Mã CLIMS",
    dataIndex: "climsCode",
    align: "left",
    width: "130px",
    fixed: "left",
  },
  {
    key: 3,
    title: "Số tờ trình",
    dataIndex: "reportCode",
    align: "left",
    width: "130px",
    fixed: "left",
  },
  {
    key: 4,
    title: "Địa chỉ thực tế",
    dataIndex: "addressDetail",
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
    key: 8,
    title: "Mục đích sử dụng đất",
    dataIndex: "usingPurposeName",
    align: "left",
    width: "180px",
  },
  {
    key: 9,
    title: "Diện tích (m²)",
    dataIndex: "areaWidth",
    align: "left",
    sorter: true,
    width: "200px",
  },
  {
    key: 10,
    title: "Đơn giá",
    dataIndex: "landUnitPrice",
    align: "right",
    sorter: true,
    render: (landUnitPrice) => (
      <>{landUnitPrice ? numberUtils.formatNumber(landUnitPrice) : ""}</>
    ),
  },
  {
    key: 10,
    title: "Giá rao bán",
    dataIndex: "estimatePrice",
    align: "right",
    sorter: true,
    render: (estimatePrice) => (
      <>{estimatePrice ? numberUtils.formatNumber(estimatePrice) : ""}</>
    ),
  },
  {
    key: 10,
    title: "Giá thương lượng",
    dataIndex: "transactionPrice",
    align: "right",
    sorter: true,
    render: (transactionPrice) => (
      <>{transactionPrice ? numberUtils.formatNumber(transactionPrice) : ""}</>
    ),
  },
  {
    key: 11,
    title: "Loại đường tiếp giáp",
    dataIndex: "roadContiguousTypeName",
    align: "center",
    render: (roadContiguousTypeName: string) => (
      <>{roadContiguousTypeName ? roadContiguousTypeName : "-"}</>
    ),
  },
  {
    key: 12,
    title: "Người tạo",
    dataIndex: "whoCreate",
    align: "center",
  },
  {
    key: 13,
    title: "Trạng thái",
    dataIndex: "transactionStatus",
    align: "center",
  },
  {
    key: 14,
    title: "Nguồn thông tin",
    dataIndex: "infoSourceName",
    align: "center",
  },
  {
    key: 15,
    title: "Vị trí",
    dataIndex: "positionName",
    align: "center",
    render: (positionName: string) => <>{positionName ? positionName : "-"}</>,
  },
  {
    key: "actions",
    align: "center",
    title: "Hành động",
    fixed: "right",
    width: "100px",
  },
];

const mockData: Array<any> = [];

export { defaulColumns, mockData };
