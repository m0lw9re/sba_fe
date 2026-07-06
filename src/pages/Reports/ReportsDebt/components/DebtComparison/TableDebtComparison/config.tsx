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
    title: "Mã Clims",
    dataIndex: "climCode",
    align: "left",
    fixed: "left",
    width: "200px",
  },
  {
    key: 2,
    title: "Số hồ sơ",
    dataIndex: "reportCode",
    align: "left",
    fixed: "left",
    width: "200px",
  },
  {
    key: 3,
    title: "Tên khách hàng",
    dataIndex: "customerName",
    align: "left",
    width: "200px",
  },
  {
    key: 4,
    title: "Địa chỉ thẩm định",
    dataIndex: "surveyAdress",
    align: "left",
    width: "200px",
  },
  {
    key: 5,
    title: "Ngày phát hành thông báo cho chi nhánh/PGD",
    dataIndex: "notifiDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 6,
    title: "Ngày ĐV đề nghị cấp KQ/không cấp KQ",
    dataIndex: "requestDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 7,
    title: "Tổng giá trị tài sản",
    dataIndex: "assetTotalValue",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 8,
    title: "Tổng phí",
    dataIndex: "totalFee",
    align: "right",
    width: "200px",
    render: (totalFee) => {
      return numberUtils.formatNumber(totalFee);
    },
  },
  {
    key: 9,
    title: "Công tác phí",
    dataIndex: "bussinessFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 10,
    title: "Phí đợt 1",
    dataIndex: "phase1Fee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 11,
    title: "Phí đợt 2",
    dataIndex: "phase2Fee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 12,
    title: "Tổng phí đã thu/GNNB/Giảm phí/Hoàn trả",
    dataIndex: "totalCashed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 13,
    title: "Tổng phí ĐV còn phải trả",
    dataIndex: "remainFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
];

export { defaultColumns };