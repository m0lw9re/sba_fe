import type { ColumnsType } from "antd/es/table";
import { numberUtils } from "utils";
import { formatToCurrencyType } from "utils/format";

const checkTitle = (record: any) => {
  if (
    record?.type === "Tổng giá trị đất (đồng)" ||
    record?.type === "Tổng giá trị công trình xây dựng (đồng)" ||
    record?.type === "Tổng giá trị tài sản (đồng)"
  ) {
    return true;
  } else {
    return false;
  }
};
const columns: ColumnsType<any> = [
  {
    title: "Loại đất/công trình xây dựng",
    dataIndex: "type",
    key: "type",
    onCell: (record, index) => ({
      colSpan: checkTitle(record) ? 3 : 1,
    }),
    render(value, record, index) {
      return (
        <div className={checkTitle(record) ? "tbody-title" : ``}>{value}</div>
      );
    },
  },
  {
    title: "Diện tích (m²)",
    dataIndex: "area",
    key: "area",
    onCell: (record, index) => ({
      colSpan: checkTitle(record) ? 0 : 1,
    }),
    render(value, record, index) {
      return <>{value ? `${numberUtils.formatNumber(value)}` : ""}</>;
    },
    align: "right",
  },
  {
    title: "Đơn giá (đồng)",
    dataIndex: "price",
    key: "price",
    onCell: (record, index) => ({
      colSpan: checkTitle(record) ? 0 : 1,
    }),
    align: "right",
    render(value, record, index) {
      return <>{value !== null ? `${numberUtils.formatNumber(value)}` : ""}</>;
    },
  },
  {
    title: "Giá trị (đồng)",
    dataIndex: "value",
    key: "value",
    onCell: (record, index) => ({
      colSpan: checkTitle(record) ? 1 : 1,
    }),
    align: "right",
    render(value, record, index) {
      return (
        <>
          {value !== null
            ? `${numberUtils.formatNumber(Math.round(value))}`
            : ""}
        </>
      );
    },
  },
];
const dataSource1Init: any[] = [
  {
    key: 1,
    type: "Đất công nhận phù hợp quy hoạch (m²)",
    area: 0,
    price: 0,
    value: 0,
  },
  {
    key: 2,
    type: "Đất công nhận không phù hợp quy hoạch (m²)",
    area: 0,
    price: 0,
    value: 0,
  },
  {
    key: 3,
    type: "Tổng giá trị đất (đồng)",
    area: 0,
    price: 0,
    value: 0,
  },
];
const dataSource3Init = [
  {
    type: "Tổng giá trị tài sản (đồng)",
    area: 0,
    price: 0,
    value: 0,
  },
];
export { columns, dataSource1Init, dataSource3Init };
