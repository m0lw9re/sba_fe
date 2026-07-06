import type { ColumnsType } from "antd/es/table";
import { formatDate, numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 0,
    title: "STT",
    dataIndex: "index",
    align: "center",
    render: (text, record, rowIndex) => rowIndex + 1,
    fixed: "left",
    width: "50px",
  },
  {
    key: 1,
    title: "Định giá viên",
    dataIndex: "staffName",
    align: "left",
    fixed: "left",
    width: "200px",
  },
  {
    key: 2,
    title: "Số hồ sơ SBA",
    dataIndex: "climsCode",
    align: "left",
    width: "200px",
  },
  {
    key: 3,
    title: "Ngày nhận",
    dataIndex: "receiveDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 5,
    title: "Chi nhánh",
    dataIndex: "branchName",
    align: "left",
    width: "200px",
  },
  {
    key: 6,
    title: "PGD",
    dataIndex: "transOffice",
    align: "left",
    width: "200px",
  },
  {
    key: 7,
    title: "Điện thoại",
    dataIndex: "phoneNumber",
    align: "left",
    width: "200px",
  },
  {
    key: 8,
    title: "Tên khách hàng",
    dataIndex: "customerName",
    align: "left",
    width: "200px",
  },
  {
    key: 8,
    title: "Địa chỉ thẩm định",
    dataIndex: "surveyAddress",
    align: "left",
    width: "200px",
  },
  {
    key: 9,
    title: "Ngày chuyển phiếu XN, đề nghị",
    dataIndex: "requestDate",
    align: "left",
    width: "135px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 10,
    title: "Tổng phí",
    dataIndex: "totalFee",
    align: "right",
    width: "150px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 11,
    title: "Xác nhận từ chối lấy KQ",
    dataIndex: "noReceiveResult",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 12,
    title: "Giảm/điều chỉnh phí",
    dataIndex: "reduceFee",
    align: "right",
    width: "150px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 13,
    title: "GNNB",
    dataIndex: "totalInternalRecord",
    align: "right",
    width: "137px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 14,
    title: "Tổng phí đã thu/GNNB/Giảm phí/Hoàn trả",
    dataIndex: "totalCashed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 15,
    title: "Hoàn trả",
    dataIndex: "totalReturn",
    align: "right",
    width: "135px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 16,
    title: "HS hết hiệu lực",
    dataIndex: "confirmDate",
    align: "left",
    width: "200px",
    render: (expiredAppraisalFile: boolean) =>
      expiredAppraisalFile ? <>Hết hiệu lực</> : <>Còn hiệu lực</>,
  },
  {
    key: 17,
    title: "Còn phải thu",
    dataIndex: "conPhaiThu",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 18,
    title: "Ngày xuất HĐ đợt 1",
    dataIndex: "exportBillDate1",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : null;
    },
  },
  {
    key: 19,
    title: "Ngày xuất HĐ đợt 2",
    dataIndex: "exportBillDate2",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : null;
    },
  },
  {
    key: 20,
    title: "Tuổi nợ",
    dataIndex: "debtAge",
    align: "left",
    width: "200px",
  },
];

export { defaultColumns };