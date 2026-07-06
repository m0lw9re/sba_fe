import { ColumnsType } from "antd/es/table";
import _ from "lodash";
import { numberUtils } from "utils";

const defaultColumns: ColumnsType<any> = [
  {
    key: 0,
    title: "STT",
    dataIndex: "key",
    width: "5%",
    align: "center",
    render: (_, record, index) => index + 1,
  },
  {
    key: 1,
    title: "Mục đích sử dụng",
    dataIndex: "usingPurposeName",
    width: "10%",
    align: "left",
  },
  {
    key: 2,
    title: "Thời hạn sử dụng",
    dataIndex: "usingPeriod",
    width: "10%",
    align: "left",
    render: (usingPeriod) => (usingPeriod ? usingPeriod : "-"),
  },
  {
    key: 3,
    title: "Diện tích sử dụng riêng (m²)",
    dataIndex: "legalPrivateArea",
    width: "10%",
    align: "left",
    render: (legalPrivateArea) =>
      legalPrivateArea ? numberUtils.formatNumber(legalPrivateArea) : "-",
  },
  {
    key: 4,
    title: "Diện tích phù hợp quy hoạch (m²)",
    dataIndex: "legalAreaInPlan",
    width: "10%",
    align: "left",
    render: (legalAreaInPlan) =>
      legalAreaInPlan ? numberUtils.formatNumber(legalAreaInPlan) : "-",
  },
  {
    key: 5,
    title: "Nguồn gốc sử dụng",
    dataIndex: "usingOrigin",
    width: "10%",
    align: "left",
    render: (usingOrigin) => (usingOrigin ? usingOrigin : "-"),
  },
  {
    key: 6,
    title: "DT khuôn viên (m²)",
    dataIndex: "legalAreaWidth",
    width: "10%",
    align: "left",
    render: (legalAreaWidth) =>
      legalAreaWidth ? numberUtils.formatNumber(legalAreaWidth) : "-",
  },
  {
    key: 7,
    title: "DT không phù hợp quy hoạch (m²)",
    dataIndex: "legalAreaUnPlan",
    width: "10%",
    align: "left",
    render: (legalAreaUnPlan, record) =>
      numberUtils.formatNumber(legalAreaUnPlan),
  },
  {
    key: 8,
    title: "Diện tích sử dụng chung (m²)",
    dataIndex: "legalCommonArea",
    width: "10%",
    align: "left",
    render: (legalCommonArea) =>
      legalCommonArea ? numberUtils.formatNumber(legalCommonArea) : "-",
  },
];

export { defaultColumns };
