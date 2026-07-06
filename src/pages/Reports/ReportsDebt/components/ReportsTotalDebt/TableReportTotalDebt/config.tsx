import { ColumnsType } from "antd/es/table";
import { numberUtils } from "utils";

const columnKeys = {
  "dauky": 0,
  "phatSinh": 1,
  "daThu": 2,
  "nho45ngay": 3,
  "lon45ngay": 4,
  "total": 5,
}

const DEBT_REPORT_CONFIG = [
  {
    dataIndex: 'collaborationFee',
    title: 'Công tác phí',
    stt: '1',
  },
  {
    dataIndex: 'phase1Fee',
    stt: '2',
    title: 'Phí đợt 1',
  },
  {
    dataIndex: 'phase2Fee',
    stt: '3',
    title: 'Phí đợt 2',
  },
  {
    dataIndex: 'phase3Fee',
    stt: '3.1',
    title: 'CN/PGD xác nhận lấy KQĐG',
  },
  {
    dataIndex: 'phase4Fee',
    stt: '3.2',
    title: 'CN/PGD chưa xác nhận lấy KQĐG',
  },
];

const defaultColumns: ColumnsType<any> = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "key",
  },
  {
    key: 1,
    title: "Khoản mục",
    dataIndex: "title",
    align: "left",
    width: "20%",
    className: "titleBold",
  },
  {
    key: 2,
    title: "Đầu kỳ",
    dataIndex: "dauKy",
    align: "right",
    render: (text: any) => {
      return numberUtils.formatNumber(text)
    }
  },
  {
    key: 3,
    title: "Phát sinh tăng",
    dataIndex: "phatSinh",
    align: "right",
    render: (text: any) => {
      return numberUtils.formatNumber(text)
    }
  },
  {
    key: 4,
    title: "Phát sinh giảm",
    dataIndex: "daThu",
    align: "right",
    render: (text: any) => {
      return numberUtils.formatNumber(text)
    }
  },
  {
    key: 5,
    title: "Cuối kỳ",
    dataIndex: "cuoiKy",
    align: "right",
    children: [
      {
        key: 5.1,
        title: "<= 45 ngày",
        dataIndex: "nho45ngay",
        align: "right",
        render: (text: any) => {
          return numberUtils.formatNumber(text)
        }
      },
      {
        key: 5.2,
        title: "> 45 ngày",
        dataIndex: "lon45ngay",
        align: "right",
        render: (text: any) => {
          return numberUtils.formatNumber(text)
        }
      },
      {
        key: 5.3,
        title: "Tổng",
        dataIndex: "total",
        align: "right",
        render: (text: any) => {
          return numberUtils.formatNumber(text)
        }
      },
    ],
  },
];

export { defaultColumns, columnKeys, DEBT_REPORT_CONFIG };