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
    width: "48px"
  },
  {
    key: 1,
    title: "Mã hồ sơ",
    dataIndex: "climsCode",
    align: "left",
    fixed: "left",
    width: "170px"
  },
  {
    key: 2,
    title: "Ngày nhận",
    dataIndex: "proposalDate",
    align: "left",
    width: "107px",
    render: (value: string) => {
      return formatDate(value);
    },
  },
  {
    key: 3,
    title: "ĐGV",
    dataIndex: "rmName",
    align: "left",
    width: "143px"
  },
  {
    key: 4,
    title: "Chi nhánh",
    dataIndex: "branchName",
    align: "left",
    width: "200px"
  },
  {
    key: 5,
    title: "PGD",
    dataIndex: "transName",
    align: "left",
    width: "200px"
  },
  {
    key: 6,
    title: "CBTĐ/Email",
    dataIndex: "rmEmail",
    align: "left",
    width: "240px",
    render: (value: any) => {
      return value && value.replace(/;/g, '\n')
    }
  },
  {
    key: 7,
    title: "ĐTDĐ",
    dataIndex: "rmPhone",
    align: "left",
    width: "143px"
  },
  {
    key: 8,
    title: "Tên KH",
    dataIndex: "customerName",
    align: "left",
    width: "143px"
  },
  {
    key: 9,
    title: "MST",
    dataIndex: "taxCode",
    align: "left",
    width: "107px"
  },
  {
    key: 10,
    title: "Địa chỉ KH",
    dataIndex: "customerAddress",
    align: "left",
    width: "180px"
  },
  {
    key: 11,
    title: "Địa chỉ thẩm định",
    dataIndex: "appraisalAddressDetail",
    align: "left",
    width: "180px"
  },
  {
    key: 12,
    title: "Tỉnh/TP",
    dataIndex: "provinceAddress",
    align: "left",
    width: "180px"
  },
  {
    key: 13,
    title: "Trạng thái hồ sơ",
    dataIndex: "fileStatusId",
    align: "left",
    width: "143px",
  },
  {
    key: 14,
    title: "Tái cấp/Vay mới",
    dataIndex: "refinance",
    align: "left",
    width: "143px"
  },
  {
    key: 15,
    title: "Tổng giá trị tài sản",
    dataIndex: "totalValue",
    align: "right",
    width: "143px",
    render: (value) => {
      return numberUtils.formatNumber(value);
    }
  },
  {
    key: 16,
    title: "Ngày khảo sát",
    dataIndex: "surveyTime",
    align: "left",
    width: "107px",
    render: (value: string) => {
      return value ? formatDate(value) : null;
    },
  },
  {
    key: 17,
    title: "Ngày phát hành TB cho CN/PGD",
    dataIndex: "appraisalSendDate",
    align: "left",
    width: "143px",
    render: (value: string) => {
      return value ? formatDate(value) : null;
    },
  },
  {
    key: 18,
    title: "Ngày bổ sung hồ sơ",
    dataIndex: "appraisalDate",
    align: "left",
    width: "143px",
    render: (value: string) => {
      return value ? formatDate(value) : null;
    },
  },
  {
    key: 19,
    title: "Số ngày xử lý",
    dataIndex: "dateComplete",
    align: "left",
    width: "143px"
  },
  {
    key: 20,
    title: "Số ngày cam kết",
    dataIndex: "dateCommitment",
    align: "left",
    width: "143px"
  },
  {
    key: 21,
    title: "Số ngày trễ hạn",
    dataIndex: "dateDelay",
    align: "left",
    width: "143px"
  },
  {
    key: 22,
    title: "Đạt/Không đạt",
    dataIndex: "isIncome",
    align: "left",
    width: "143px",
    render: (isIncome: boolean) => (
      isIncome ? <>Đạt</> : <>Không đạt</>
    ),
  },
  {
    key: 23,
    title: "Khu vực",
    dataIndex: "regionName",
    align: "left",
    width: "250px"
  },
];

export { defaultColumns };
