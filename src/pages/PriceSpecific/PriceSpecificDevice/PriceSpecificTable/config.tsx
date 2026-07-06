import { ColumnsType } from "antd/es/table";
import { addMonthsToDate, formatDate } from "utils";

const defaulColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "key",
    align: "center",
    width: "75px",
    fixed: "left"
  },
  {
    key: 2,
    title: "Mã kho",
    dataIndex: "assetCode",
    align: "left",
    sorter:true,
    width: "130px",
    fixed: "left"
  },
  {
    key: 21,
    title: "Mã CLIMS",
    dataIndex: "climsCode",
    align: "left",
    width: "130px",
    fixed: "left"
  },
  {
    key: 3,
    title: "Tên MMTB",
    dataIndex: "name",
    align: "left",
    width: "130px",
  },
  {
    key: 4,
    title: "Nhãn hiệu",
    dataIndex: "brand",
    align: "left",
    width: "100px",
  },
  {
    key: 7,
    title: "Số loại/Model",
    dataIndex: "model",
    align: "left",
    width: "100px",
  },
  {
    key: 9,
    title: "Động cơ (kW)",
    dataIndex: "power",
    align: "center",
    width: "100px",
  },
  {
    key: 11,
    title: "Thời điểm hiệu lực",
    dataIndex: "appraisalTime",
    align: "center",
    render: (appraisalTime: string) => (
      <>{appraisalTime ? addMonthsToDate(appraisalTime, 0) : null}</>
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
    dataIndex: "status",
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
    title: "Thời điểm hết hiệu lực",
    dataIndex: "expirationTime",
    align: "center",
    render: (expirationTime) => <>{formatDate(expirationTime)}</>,
  },
  {
    key: "actions",
    align: "center",
    title: "Hành động",
    width: "100px",
    fixed: "right"
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
