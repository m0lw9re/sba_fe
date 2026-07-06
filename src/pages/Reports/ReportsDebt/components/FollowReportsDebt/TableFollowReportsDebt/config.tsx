import type { ColumnsType } from "antd/es/table";
import { formatDate, numberUtils } from "utils";
import { toRoundNumber } from "utils/format";

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
    title: "ĐGV",
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
    title: "Khu vực",
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
    title: "Tình trạng hồ sơ",
    dataIndex: "fileStatus",
    align: "left",
    width: "280px",
  },
  {
    key: 10,
    title: "Ngày phát hành thông báo cho CN/PGD",
    dataIndex: "notifiDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 11,
    title: "Ngày chuyển phiếu XN/ đề nghị",
    dataIndex: "confirmDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 12,
    title: "Tổng phí",
    dataIndex: "feeTotal",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 13,
    title: "Công tác phí",
    dataIndex: "feeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 14,
    title: "Phí đợt 1",
    dataIndex: "oneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 15,
    title: "Phí đợt 2 (XN lấy KQĐG)",
    dataIndex: "twoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 16,
    title: "Phí đợt 2 (chưa XN)",
    dataIndex: "twoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 17,
    title: "Phí đợt 2 (XN từ chối lấy KQĐG)",
    dataIndex: "notReceiveResults",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 18,
    title: "Ngày giảm/điều chỉnh CTP",
    dataIndex: "feeTwo",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 19,
    title: "Ngày giảm/điều chỉnh phí đợt 1",
    dataIndex: "reduceOneTimeFeeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 20,
    title: "Ngày giảm/điều chỉnh phí đợt 2",
    dataIndex: "reduceTwoTimeFeeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 21,
    title: "Giảm/điều chỉnh công tác phí",
    dataIndex: "reduceFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 22,
    title: "Giảm/điều chỉnh phí đợt 1",
    dataIndex: "reduceOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 23,
    title: "Giảm/điều chỉnh phí đợt 2",
    dataIndex: "reduceTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 24,
    title: "Giảm/điều chỉnh phí đợt 2 (XN lấy KQĐG)",
    dataIndex: "reduceTwoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 25,
    title: "Giảm/điều chỉnh phí đợt 2 (chưa XN)",
    dataIndex: "reduceTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 26,
    title: "Tổng giảm/điều chỉnh phí",
    dataIndex: "totalReduceFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 27,
    title: "Ngày GNNB CTP",
    dataIndex: "assetTotal",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 28,
    title: "Ngày GNNB phí đợt 1",
    dataIndex: "internalRecordOneTimeFeeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 29,
    title: "Ngày GNNB phí đợt 2",
    dataIndex: "internalRecordTwoTimeFeeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 30,
    title: "GNNB công tác phí",
    dataIndex: "internalRecordFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 31,
    title: "GNNB đợt 1",
    dataIndex: "internalRecordOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 32,
    title: "GNNB đợt 2",
    dataIndex: "internalRecordTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 33,
    title: "GNNB đợt 2 (XN lấy KQĐG)",
    dataIndex: "internalRecordOneTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 34,
    title: "GNNB đợt 2 (chưa XN)",
    dataIndex: "internalRecordTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 35,
    title: "Tổng GNNB",
    dataIndex: "totalInternalRecord",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 36,
    title: "Ngày thu tiền CTP",
    dataIndex: "assetTotal",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 37,
    title: "Ngày thu tiền đợt 1",
    dataIndex: "cashOneTimeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 38,
    title: "Ngày thu tiền đợt 2",
    dataIndex: "cashTwoTimeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 39,
    title: "CT phí đã thu",
    dataIndex: "cashFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 40,
    title: "Phí đã thu đợt 1",
    dataIndex: "cashOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 41,
    title: "Phí đã thu đợt 2",
    dataIndex: "cashTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 42,
    title: "Phí đợt 2 đã thu(XN lấy KQĐG)",
    dataIndex: "cashTwoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 43,
    title: "Phí đợt 2 đã thu(chưa XN)",
    dataIndex: "cashTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 44,
    title: "Tổng phí đã thu",
    dataIndex: "totalCash",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 45,
    title: "Ngày hoàn trả CTP",
    dataIndex: "assetTotal",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 46,
    title: "Ngày hoàn trả phí đợt 1",
    dataIndex: "returnOneTimeFeeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 47,
    title: "Ngày hoàn trả phí đợt 2",
    dataIndex: "returnTwoTimeFeeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 48,
    title: "Hoàn trả CTP",
    dataIndex: "returnFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 49,
    title: "Hoàn trả phí đợt 1",
    dataIndex: "returnOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 50,
    title: "Hoàn trả phí đợt 2",
    dataIndex: "returnTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 51,
    title: "Hoàn trả phí đợt 2(đã XN)",
    dataIndex: "returnTwoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 52,
    title: "Hoàn trả phí đợt 2(chưa XN)",
    dataIndex: "returnTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 53,
    title: "Tổng hoàn trả",
    dataIndex: "totalReturn",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 54,
    title: "Ngày hết hiệu lực",
    dataIndex: "expiredDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 55,
    title: "Nợ CTP",
    dataIndex: "debtFeeBusiness",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 56,
    title: "Nợ phí đợt 1",
    dataIndex: "debtOneTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 57,
    title: "Nợ phí đợt 2",
    dataIndex: "debtTwoTimeFee",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 58,
    title: "Nợ phí đợt 2(XN lấy KQĐG)",
    dataIndex: "debtTwoTimeFeeConfirmed",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 59,
    title: "Nợ phí đợt 2 (Chưa XN lấy KQDG)",
    dataIndex: "debtTwoTimeFeeUnconfimred",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 60,
    title: "Tổng công nợ phải thu",
    dataIndex: "remainMustCash",
    align: "right",
    width: "200px",
    render: (value) => {
      return numberUtils.formatNumber(toRoundNumber(value));
    },
  },
  {
    key: 61,
    title: "Ngày xuất HĐ đợt 1",
    dataIndex: "billOneTimeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 62,
    title: "Ngày xuất HĐ đợt 2",
    dataIndex: "billTwoTimeDate",
    align: "left",
    width: "200px",
    render: (value: string) => {
      return value ? formatDate(value) : "";
    },
  },
  {
    key: 63,
    title: "Tuổi nợ",
    dataIndex: "ageDebt",
    align: "left",
    width: "200px",
  },
];

export { defaultColumns };