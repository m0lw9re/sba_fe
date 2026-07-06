import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { formatDate, numberUtils } from "utils";

const checkStatusLabel = (startDate: any, endDate: any) => {
  const currentDate = dayjs();
  //return true là đang hiệu lực; false là hết hiệu lực

  if (!startDate && !endDate) return false;
  else if (!startDate) {
    const _endDate = dayjs(endDate);
    if (currentDate <= _endDate) return true;
    else return false;
  } else if (!endDate) {
    const _startDate = dayjs(startDate);
    if (currentDate >= _startDate) return true;
    else return false;
  } else {
    const _startDate = dayjs(startDate);
    const _endDate = dayjs(endDate);
    if (_startDate <= currentDate && currentDate <= _endDate) return true;
    else return false;
  }
};

const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    render: (text, record, rowIndex) => rowIndex + 1,
    align: "center",
    width: "50px",
  },
  {
    key: 2,
    title: "Loại hình tài sản",
    dataIndex: "assetLevelTwoName",
    width: "400px",
  },
  {
    key: 3,
    title: "Phân loại tài sản",
    dataIndex: "assetLevelThreeName",
    width: "550px",
  },
  {
    key: 4,
    title: "Biểu phí",
    dataIndex: "feeCode",
    width: "250px",
  },
  {
    key: 5,
    title: "Loại Biểu phí",
    dataIndex: "idFeeScheduleIdNew",
    width: "150px",
    align: "center",
  },
  {
    key: 56,
    title: "Giá trị tài sản",
    children: [
      {
        title: "Từ (đồng)",
        dataIndex: "assetValidationForm",
        key: 7,
        render: (text) => numberUtils.formatNumber(text),
        align: "right",
        width: "250px",
      },
      {
        title: "Đến (đồng)",
        dataIndex: "assetValidationUpTo",
        key: 8,
        render: (text) => numberUtils.formatNumber(text),
        align: "right",
        width: "250px",
      },
    ],
  },
  {
    key: 9,
    title: "Mức phí",
    children: [
      {
        title: "Tối thiểu",
        dataIndex: "minimumFee",
        key: 10,
        render: (text) => numberUtils.formatNumber(text),
        align: "right",
        width: "250px",
      },
      {
        title: "Mức phí tối đa HSTĐ mới (đồng)",
        dataIndex: "maximumFeeHstdNew",
        key: 11,
        render: (text) => numberUtils.formatNumber(text),
        align: "right",
        width: "250px",
      },
      {
        title: "Mức phí tối đa HSTĐ tái cấp (đồng)",
        dataIndex: "maximumFeeHstdReissue",
        key: 12,
        render: (text) => numberUtils.formatNumber(text),
        align: "right",
        width: "250px",
      },
      {
        title: "Mức phí",
        dataIndex: "feeLevel",
        key: 13,
        render: (feeLevel: any) =>
          feeLevel === 1 ? "% giá trị TSTĐ" : "Giá trị TSTĐ",
        width: "350px",
        align: "center",
      },
      {
        title: "ĐVT",
        dataIndex: "feeLevel",
        key: 14,
        align: "center",
        render: (feeLevel: any) => (feeLevel === 1 ? "%" : "đ"),
      },
      {
        title: "Mức phí TĐHS mới",
        dataIndex: "",
        key: 15,
        render: (_, record: any) => {
          const valToShow =
            record.feeLevel === 0
              ? record.newHstdRegistrationFee
              : record.newHstdRegistrationFeePercent;
          return numberUtils.formatNumber(valToShow);
        },
        align: "right",
        width: "250px",
      },
      {
        title: "Mức phí TĐHS tái cấp",
        dataIndex: "",
        key: 16,
        render: (_, record) => {
          const valToShow =
            record.feeLevel === 0
              ? record.registrationFeeHstdReissuance
              : record.registrationFeeHstdReissuancePercent;
          return numberUtils.formatNumber(valToShow);
        },
        align: "right",
        width: "250px",
      },
    ],
  },
  {
    key: 17,
    title: "Hiệu lực",
    children: [
      {
        key: 18,
        title: "Từ",
        dataIndex: "effectiveFrom",
        width: "250px",
        align: "center",
        render: (value: string) => {
          return value ? formatDate(value) : "";
        },
      },
      {
        key: 19,
        title: "Đến",
        dataIndex: "validUntil",
        width: "250px",
        align: "center",
        render: (value: string) => {
          return value ? formatDate(value) : "";
        },
      },
    ],
  },
  {
    key: 20,
    title: "Trạng thái hiệu lực",
    dataIndex: "status",
    width: "300px",
    align: "center",
    render: (_, record: any) => {
      return checkStatusLabel(record.effectiveFrom, record.validUntil)
        ? "Đang hiệu lực"
        : "Hết hiệu lực";
    },
  },
  {
    key: 21,
    title: "Áp dụng phí ưu đãi",
    dataIndex: "applyPromotion",
    width: "300px",
    align: "center",
    render: (applyPromotion: any) =>
      applyPromotion === true ? "Có áp dụng" : "Không áp dụng",
  },
  {
    key: 22,
    title: "Hành động",
    dataIndex: "0",
    align: "center",
  },
];

export { defaultColumns, checkStatusLabel };
