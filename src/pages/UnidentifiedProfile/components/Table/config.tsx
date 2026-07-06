import type { ColumnsType } from "antd/es/table";
import { formatDate, numberUtils } from "../../../../utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "stt",
    align: "center",
    width: 50,
    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 1.5,
    title: "Số chứng từ báo có",
    dataIndex: "creditNoteCode",
    width: 180,
  },
  {
    key: 2,
    title: "Số tờ trình",
    dataIndex: "reportCode",
    width: 180,
  },
  {
    key: 3,
    title: "Mã hồ sơ",
    dataIndex: "proposalCode",
    width: 160,
  },
  {
    key: 4,
    title: "Tính chất, loại phí",
    dataIndex: "content",
    width: 130,
    render: (text, record) =>
      record.feeNotificationId != null ? record.content : record.phaseContent,
  },
  {
    key: 5,
    title: "Tên khách hàng",
    dataIndex: "customerName",
    width: 200,
  },
  {
    key: 6,
    title: "MST",
    dataIndex: "mst",
    align: "center",
    width: 130,
  },
  {
    key: 7,
    title: "Đơn vị thẩm định",
    dataIndex: "orgAppraisal",
    width: 100,
  },
  {
    key: 8,
    title: "Đơn vị yêu cầu định giá",
    dataIndex: "orgRequestValuation",
    width: 120,
  },
  {
    key: 9,
    title: "Tổng tiền (đồng)",
    dataIndex: "totalAmount",
    align: "right",
    width: 120,
    render: (_, record) =>
      record.totalAmount ? numberUtils.formatNumber(record.totalAmount) : 0,
  },
  {
    key: 10,
    title: "Ngày hạch toán",
    dataIndex: "refDate",
    width: 150,
    render: (_, record) => (record.refDate ? formatDate(record.refDate) : ""),
  },
  {
    key: 11,
    title: "Nội dung thanh toán",
    dataIndex: "descr",
    width: 200,
  },
  {
    key: 11.5,
    title: "Chứng từ",
    dataIndex: "uploadFile",
    width: "200px",
  },
  {
    key: 12,
    title: "Trạng thái",
    dataIndex: "statusEmsStr",
    width: "150px",
  },
  {
    key: 13,
    title: "Hành động",
    dataIndex: "hanhDong",
    align: "center",
    width: "150px",
    fixed: "right",
  },
];

export { defaultColumns };