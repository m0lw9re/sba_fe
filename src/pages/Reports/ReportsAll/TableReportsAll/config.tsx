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
    title: "Số hồ sơ",
    dataIndex: "reportCode",
    align: "left",
    fixed: "left",
    width: "200px",
  },
  {
    key: 2,
    title: "Ngày nhận",
    dataIndex: "proposalDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 3,
    title: "Định giá viên",
    dataIndex: "staffName",
    align: "left",
    width: "200px",
  },
  {
    key: 4,
    title: "Chi nhánh",
    dataIndex: "branchName",
    align: "left",
    width: "200px",
  },
  {
    key: 5,
    title: "PGD",
    dataIndex: "transOfficeName",
    align: "left",
    width: "200px",
  },
  {
    key: 6,
    title: "Khu vực Sacombank",
    dataIndex: "regionName",
    align: "left",
    width: "200px",
  },
  {
    key: 7,
    title: "Tên khách hàng",
    dataIndex: "customerName",
    align: "left",
    width: "200px",
  },
  {
    key: 8,
    title: "Địa chỉ thẩm định",
    dataIndex: "address",
    align: "left",
    width: "200px",
  },
  {
    key: 9,
    title: "Tỉnh/TP",
    dataIndex: "provinceName",
    align: "left",
    width: "135px",
  },
  {
    key: 10,
    title: "Trạng thái hồ sơ",
    dataIndex: "fileStatus",
    align: "left",
    width: "150px",
  },
  {
    key: 11,
    title: "Ngày khảo sát",
    dataIndex: "surveyTime",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 12,
    title: "Ngày bổ sung hồ sơ",
    dataIndex: "addFileDate",
    align: "left",
    width: "150px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 13,
    title: "Ngày huỷ",
    dataIndex: "cancelDate",
    align: "left",
    width: "137px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 14,
    title: "Ngày phát hành thông báo cho chi nhánh/PGD",
    dataIndex: "notifiDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 15,
    title: "Số ngày thực hiện",
    dataIndex: "implDate",
    align: "left",
    width: "135px",
  },
  {
    key: 16,
    title: "Ngày xác nhận đề nghị",
    dataIndex: "confirmDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 17,
    title: "Tổng giá trị tài sản",
    dataIndex: "totalValue",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 18,
    title: "Tổng phí",
    dataIndex: "feeTotal",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 19,
    title: "Công tác phí",
    dataIndex: "feeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 20,
    title: "Phí đợt 1",
    dataIndex: "oneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 21,
    title: "Phí đợt 2",
    dataIndex: "twoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 22,
    title: "Phí đợt 2(đã XN)",
    dataIndex: "twoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 23,
    title: "Phí đợt 2(chưa XN)",
    dataIndex: "twoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 24,
    title: "Không nhận kết quả",
    dataIndex: "notReceiveResults",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 25,
    title: "Ngày miễn, giảm phí đợt 1",
    dataIndex: "reduceOneTimeFeeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 26,
    title: "Ngày miễn, giảm phí đợt 2",
    dataIndex: "reduceTwoTimeFeeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 27,
    title: "Miễn giảm công tác phí",
    dataIndex: "reduceFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 28,
    title: "Miễn, giảm phí đợt 1",
    dataIndex: "reduceOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 29,
    title: "Miễn, giảm phí đợt 2",
    dataIndex: "reduceTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 30,
    title: "Miễn, giảm phí đợt 2 (đã XN)",
    dataIndex: "reduceTwoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 31,
    title: "Miễn, giảm phí đợt 2 (chưa XN)",
    dataIndex: "reduceTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 32,
    title: "Tổng miễn giảm phí",
    dataIndex: "totalReduceFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 33,
    title: "Ngày GNNB phí đợt 1",
    dataIndex: "internalRecordOneTimeFeeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 34,
    title: "Ngày GNNB phí đợt 2",
    dataIndex: "internalRecordTwoTimeFeeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 35,
    title: "GNNB công tác phí",
    dataIndex: "internalRecordFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 36,
    title: "GNNB đợt 1",
    dataIndex: "internalRecordOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 37,
    title: "GNNB đợt 2",
    dataIndex: "internalRecordTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 38,
    title: "GNNB đợt 2 (đã XN)",
    dataIndex: "internalRecordOneTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 39,
    title: "GNNB đợt 2 (chưa XN)",
    dataIndex: "internalRecordTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 40,
    title: "Tổng GNNB",
    dataIndex: "totalInternalRecord",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 41,
    title: "Ngày hoàn trả phí đợt 1",
    dataIndex: "returnOneTimeFeeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 42,
    title: "Ngày hoàn trả phí đợt 2",
    dataIndex: "returnTwoTimeFeeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 43,
    title: "Hoàn trả công tác phí",
    dataIndex: "returnFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 44,
    title: "Hoàn trả phí đợt 1",
    dataIndex: "returnOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 45,
    title: "Hoàn trả phí đợt 2",
    dataIndex: "returnTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 46,
    title: "Hoàn trả phí đợt 2 (đã XN)",
    dataIndex: "returnTwoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 47,
    title: "Hoàn trả phí đợt 2 (chưa XN)",
    dataIndex: "returnTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 48,
    title: "Tổng hoàn trả",
    dataIndex: "totalReturn",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 49,
    title: "Ngày thu tiền đợt 1",
    dataIndex: "cashOneTimeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 50,
    title: "Ngày thu tiền đợt 2",
    dataIndex: "cashTwoTimeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 51,
    title: "Công tác phí đã thu",
    dataIndex: "cashFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 52,
    title: "Phí đã thu đợt 1",
    dataIndex: "cashOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 53,
    title: "Phí đã thu đợt 2",
    dataIndex: "cashTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 54,
    title: "Phí đợt 2 đã thu (đã XN)",
    dataIndex: "cashTwoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 55,
    title: "Phí đợt 2 đã thu (chưa XN)",
    dataIndex: "cashTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 56,
    title: "Tổng phí đã thu",
    dataIndex: "totalCash",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 57,
    title: "Nợ công tác phí",
    dataIndex: "debtFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 58,
    title: "Nợ phí đợt 1",
    dataIndex: "debtOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 59,
    title: "Nợ phí đợt 2",
    dataIndex: "debtTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 60,
    title: "Nợ phí đợt 2 (có XN)",
    dataIndex: "debtTwoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 61,
    title: "Nợ phí đợt 2 (chưa XN)",
    dataIndex: "debtTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 62,
    title: "Còn lại phải thu",
    dataIndex: "remainMustCash",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 63,
    title: "Thu dư",
    dataIndex: "cashSurplus",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 64,
    title: "Ngày xuất HĐ đợt 1",
    dataIndex: "billOneTimeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 65,
    title: "Số tiền xuất HĐ",
    dataIndex: "billOneTime",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 66,
    title: "Ngày xuất HĐ đợt 2",
    dataIndex: "billTwoTimeDate",
    align: "right",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 67,
    title: "Số tiền xuất HĐ",
    dataIndex: "billTwoTime",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 68,
    title: "Tuổi nợ đợt 1",
    dataIndex: "ageDebtOneTime",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 69,
    title: "Tuổi nợ đợt 2",
    dataIndex: "ageDebtTwoTime",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    },
  },
  {
    key: 70,
    title: "Trạng thái công nợ",
    dataIndex: "statusDebt",
    align: "right",
    width: "200px",
  },
];

export { defaultColumns };
