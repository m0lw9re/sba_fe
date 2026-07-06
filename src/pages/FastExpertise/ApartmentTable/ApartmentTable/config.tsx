import { ColumnProps } from "constants/types/common.type";
import { combineAddress } from "utils/common";
import { formatToCurrencyType } from "utils/format";
import { addMonthsToDate } from "utils";
import { Tooltip } from "antd";

const defaultColumns: ColumnProps[] = [
  {
    key: 1,
    title: "STT",
    dataIndex: "stt",
    fixed: "left",
    width: "50px",
    align: "center",
  },
  {
    key: 2,
    title: "Tên khách hàng",
    dataIndex: "customerName",
    width: "160px",
  },
  {
    key: 3,
    title: "CCCD/CC/HC/CMTQĐ/MST/ĐKKD",
    dataIndex: "customerIdentity",
    width: "130px",
  },
  // {
  //   key: 4,
  //   title: "Số sổ",
  //   dataIndex: "codeBook",
  //   width: "130px"
  // },
  // {
  //   key: 5,
  //   title: "Số tờ bản đồ",
  //   dataIndex: "mapSheetNumber",
  //   width: "130px"
  // },
  // {
  //   key: 6,
  //   title: "Địa chỉ",
  //   dataIndex: "address",
  //   render(value, record, index) {
  //     return (
  //       <>
  //         {combineAddress(
  //           record?.addressDetail,
  //           record?.addressStreet,
  //           record?.addressWard,
  //           record?.addressDistrict,
  //           record?.addressProvince
  //         )}
  //       </>
  //     );
  //   },
  //   width: 420,
  // },
  {
    key: 11,
    title: "Thời gian thực hiện",
    dataIndex: "dateCreate",
    sorter: true,
    render: (dateCreate: string) => (
      <>{dateCreate ? addMonthsToDate(dateCreate, 0) : null}</>
    ),
    width: "180px",
  },
  {
    key: 11,
    title: "Người thực hiện",
    dataIndex: "whoCreate",
    render: (text) => (
      <Tooltip title={text}>
        <div className="inline-text">{text}</div>
      </Tooltip>
    ),
    width: "150px",
  },
  {
    key: 9,
    title: "Giá trị tài sản (đồng)",
    dataIndex: "optimizePrice",
    sorter: true,
    render: (value: any, index: any, record: any) => {
      return <>{value !== null ? formatToCurrencyType(value) : ""}</>;
    },
    fixed: "right",
    align: "right",
    width: "200px",
  },

  {
    key: 10,
    title: "Hành động",
    dataIndex: "4",
    fixed: "right",
    align: "center",
    width: "80px",
  },
];
export { defaultColumns };
