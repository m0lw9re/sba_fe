import { ColumnsType } from "antd/es/table";
import { numberUtils } from "utils";
import { formatToCurrencyType } from "utils/format";

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
    key: 3,
    title: "Mã CLIMS",
    dataIndex: "climsCode",
    align: "left",
    width: "130px",
    fixed: "left",
  },
  {
    key: 4,
    title: "Số tờ trình",
    dataIndex: "reportCode",
    align: "left",
    width: "130px",
    fixed: "left",
  },
  {
    key: 5,
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
    key: 6,
    title: "Mục đích sử dụng đất",
    dataIndex: "usingPurposeName",
    align: "left",
    width: "280px",
  },
  {
    key: 7,
    title: "Diện tích (m²)",
    dataIndex: "areaWidth",
    align: "right",
    sorter: true,
    render: (areaWidth) => numberUtils.formatNumber(areaWidth),
  },
  // {
  //   key: 8,
  //   title: "Đơn giá",
  //   dataIndex: "landUnitPrice",
  //   align: "right",
  //   render: (landUnitPrice) => (
  //     <>{landUnitPrice !== null ? formatToCurrencyType(landUnitPrice) : ""}</>
  //   ),
  // },
  {
    key: 9,
    title: "Tổng giá trị tài sản",
    dataIndex: "totalValue",
    align: "right",
    sorter: true,
    render: (totalValue, record: any) => {
      return numberUtils.formatNumber(totalValue || record?.transactionPrice);
    },
  },
  {
    key: 10,
    title: "Loại đường tiếp giáp",
    dataIndex: "roadContiguousTypeName",
    align: "center",
    render: (roadContiguousTypeName: string) => (
      <>{roadContiguousTypeName ? roadContiguousTypeName : "-"}</>
    ),
  },
  {
    key: 11,
    title: "Người tạo",
    dataIndex: "whoCreate",
    align: "center",
  },
  {
    key: 12,
    title: "Trạng thái",
    dataIndex: "transactionStatus",
    align: "center",
  },
  {
    key: 13,
    title: "Nguồn thông tin",
    dataIndex: "infoSourceName",
    align: "center",
  },
  {
    key: 14,
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

for (let i = 0; i <= 10; i++) {
  const item: any = {
    key: i + 1,
    warehouseCode: "23.000308.SBA",
    climsCode: "91829182.STC",
    numberReport: "91829182",
    realAddress: "Xã Đông Hưng A, Hu...",
    trafficLine: "VT4",
    purposeLandUsage: "Đất ở",
    area: "82.2",
    singlePrice: "39,000,000",
    dateCreate: "27/03/2023",
    creator: "Nguyễn Văn B",
    status: "Hiệu lực",
    sourceData: "-",
    uneffectTime: "27/03/2024",
  };
  mockData.push(item);
}

export { defaulColumns, mockData };
