import { ColumnsType } from "antd/es/table";

const defaulColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    align: "center",
  },
  {
    key: 2,
    title: "Mã kho",
    dataIndex: "warehouseCode",
    align: "left",
  },
  {
    key: 21,
    title: "Mã CLIMS",
    dataIndex: "climsCode",
    align: "left",
  },
  {
    key: 3,
    title: "Số tờ trình",
    dataIndex: "numberReport",
    align: "left",
  },
  {
    key: 4,
    title: "Địa chỉ thực tế",
    dataIndex: "realAddress",
    align: "left",
  },
  // {
  //   key: 7,
  //   title: "Lộ giới giao thông",
  //   dataIndex: "roadContiguousTypeId",
  //   align: "left",
  // },
  {
    key: 8,
    title: "Mục đích sử dụng đất",
    dataIndex: "purposeLandUsage",
    align: "left",
  },
  {
    key: 9,
    title: "Diện tích (m²)",
    dataIndex: "area",
    align: "right",
  },
  {
    key: 10,
    title: "Đơn giá",
    dataIndex: "singlePrice",
    align: "right",
  },
  {
    key: 11,
    title: "Thời điểm hiệu lực",
    dataIndex: "appraisalTime",
    align: "center",
    // render: (effectTime) => <>{formatDate(effectTime)}</>,
  },
  {
    key: 12,
    title: "Người tạo",
    dataIndex: "creator",
    align: "left",
  },
  {
    key: 13,
    title: "Trạng thái",
    dataIndex: "status",
    align: "left",
  },
  {
    key: 14,
    title: "Nguồn dữ liệu",
    dataIndex: "sourceData",
    align: "left",
  },
  {
    key: 15,
    title: "Thời điểm hết hiệu lực",
    dataIndex: "expirationTime",
    align: "center",
    // render: (uneffectTime) => <>{formatDate(uneffectTime)}</>,
  },
  {
    key: "actions",
    align: "center",
    title: "Hành động",
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
    effectTime: "27/03/2023",
    creator: "Nguyễn Văn B",
    status: "Hiệu lực",
    sourceData: "-",
    uneffectTime: "27/03/2024",
  };
  mockData.push(item);
}

export { defaulColumns, mockData };
