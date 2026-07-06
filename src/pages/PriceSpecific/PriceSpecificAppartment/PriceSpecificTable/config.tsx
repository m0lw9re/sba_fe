import { ColumnsType } from "antd/es/table";
import { addMonthsToDate, formatDate, numberUtils } from "utils";

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
    dataIndex: "address",
    align: "left",
    width: "420px",
  },
  {
    key: 8,
    title: "Mục đích sử dụng",
    dataIndex: "usingPurposeName",
    align: "left",
    width: "180px",
    render: (usingPurposeName) => {
      return usingPurposeName || "Đất ở";
    },
  },
  {
    key: 9,
    title: "Diện tích (m²)",
    dataIndex: "totalFloorArea",
    align: "right",
    sorter: true,
    width: "100px",
    render: (_, record: any) => {
      if (record?.totalFloorArea)
        return numberUtils.formatNumber(record?.totalFloorArea);
      else if (record?.privateUseArea)
        return numberUtils.formatNumber(record?.privateUseArea);
      else if (record?.clearanceArea)
        return numberUtils.formatNumber(record?.clearanceArea);
      else if (record?.buildupArea)
        return numberUtils.formatNumber(record?.buildupArea);
      else if (record?.extendArea)
        return numberUtils.formatNumber(record?.extendArea);
      else return "";
    },
  },
  {
    key: 10,
    title: "Đơn giá",
    dataIndex: "unitPrice",
    align: "right",
    sorter: true,
    render: (unitPrice) => (
      <>{unitPrice ? numberUtils.formatNumber(unitPrice) : ""}</>
    ),
  },
  {
    key: 11,
    title: "Tổng giá trị tài sản",
    align: "right",
    sorter: true,
    render: (_, record: any) => {
      const transactionPrice = record?.transactionPrice || 0;
      const estimatePrice = record?.estimatePrice || 0;

      return transactionPrice
        ? numberUtils.formatNumber(transactionPrice)
        : numberUtils.formatNumber(estimatePrice);
    },
  },
  {
    key: 12,
    title: "Thời điểm hiệu lực",
    dataIndex: "appraisalTime",
    align: "center",
    render: (appraisalTime: string) => (
      <>{appraisalTime ? addMonthsToDate(appraisalTime, 0) : null}</>
    ),
  },
  {
    key: 13,
    title: "Người tạo",
    dataIndex: "whoCreate",
    align: "left",
    width: "250px",
  },
  {
    key: 14,
    title: "Trạng thái",
    dataIndex: "transactionStatus",
    align: "center",
  },
  {
    key: 15,
    title: "Nguồn thông tin",
    dataIndex: "infoSourceName",
    align: "center",
  },
  {
    key: 16,
    title: "Thời điểm hết hiệu lực",
    dataIndex: "expirationTime",
    align: "center",
    render: (expirationTime: string) => {
      return expirationTime ? formatDate(expirationTime) : "-";
    },
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
