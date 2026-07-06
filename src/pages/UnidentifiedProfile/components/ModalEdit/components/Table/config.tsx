import type { ColumnsType } from "antd/es/table";
import { numberUtils } from "../../../../../../utils";
import { FeeContentType } from "constant/types/appraisalFilesDetail";

const handleGetTotalPrice = (feeContent: FeeContentType[]) => {
  return feeContent.reduce((total: any, item: FeeContentType) => {
    return total + (item?.soTienCanKhopConLai || 0);
  }, 0);
};
const defaultColumns: ColumnsType<any> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "stt",
    align: "center",
    width: "5%",
    render: (text, record, rowIndex) => rowIndex + 1,
  },
  {
    key: 2,
    title: "Số tờ trình",
    dataIndex: "reportCode",
  },
  {
    key: 3,
    title: "Mã hồ sơ",
    dataIndex: "proposalCode",
  },
  {
    key: 4,
    title: "Tên KH",
    dataIndex: "customerName",
  },
  {
    key: 5,
    title: "Chi nhánh",
    dataIndex: "transOfficeName",
  },
  {
    key: 6,
    title: "Tổng tiền",
    dataIndex: "totalPrice",
    align: "right",
    render: (_, record) => {
      return (
        numberUtils.formatNumber(handleGetTotalPrice(record.feeContents)) || 0
      );
    },
  },
];

export { defaultColumns };
