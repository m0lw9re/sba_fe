import { Tooltip } from "antd";
import { ColumnProps } from "constants/types/common.type";
import { addMonthsToDate } from "utils";
import { combineAddress } from "utils/common";
import { formatToCurrencyType } from "utils/format";

const defaultColumns: ColumnProps[] = [
  {
    key: 1,
    title: "STT",
    dataIndex: "stt",
    width: 45,
    fixed: "left",
    align: "center",
  },
  {
    key: 2,
    title: "Tên khách hàng",
    dataIndex: "customerName",
    width: 160,
  },
  {
    key: 3,
    title: "CCCD/CC/HC/CMTQĐ/MST/ĐKKD",
    dataIndex: "customerIdentity",
    width: 130,
  },
  {
    key: 4,
    title: "Số thửa",
    dataIndex: "landPlotNumber",
    width: 130,
  },
  {
    key: 5,
    title: "Số tờ bản đồ",
    dataIndex: "mapSheetNumber",
    width: 130,
  },
  {
    key: 6,
    title: "Địa chỉ",
    dataIndex: "address",
    render(value, record, index) {
      return (
        <>
          {combineAddress(
            record?.addressDetail,
            record?.addressStreet,
            record?.addressWard,
            record?.addressDistrict,
            record?.addressProvince
          )}
        </>
      );
    },
    width: 420,
  },
  {
    key: 7,
    title: "DT khuôn viên (m²)",
    dataIndex: "areaWidth",
    align: "left",
    sorter: true,
    width: 200,
    render: (value: any, index: any, record: any) => {
      return <>{value !== null ? formatToCurrencyType(value) : ""}</>;
    },
  },
  {
    key: 8,
    title: "Mục đích sử dụng đất",
    dataIndex: "usingPurposeName",
    align: "left",
    width: 200,
  },
  {
    key: 11,
    title: "Thời gian thực hiện",
    dataIndex: "dateCreate",
    sorter: true,
    render: (dateCreate: string) => (
      <>{dateCreate ? addMonthsToDate(dateCreate, 0) : null}</>
    ),
    width: 180,
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
    width: 150,
  },
  {
    key: 9,
    title: "Giá trị tài sản (đồng)",
    dataIndex: "totalValue",
    sorter: true,
    render: (value: any, index: any, record: any) => {
      return <>{value !== null ? formatToCurrencyType(value) : ""}</>;
    },
    width: 200,
    fixed: "right",
    align: "right",
  },
  {
    key: 10,
    title: "Hành động",
    dataIndex: "4",
    width: 80,
    fixed: "right",
    align: "center",
  },
];
export { defaultColumns };
