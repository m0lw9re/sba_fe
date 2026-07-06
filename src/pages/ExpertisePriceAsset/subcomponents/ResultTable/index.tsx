import { Table, Input, Select, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import "pages/ExpertisePriceAsset/subcomponents/ResultTable/style.scss";
import Icons from "assets/icons";

type DataTable = {
  key: number;
  index: number;
  content: string;
  quyHoach: string;
  priceGoal: string;
  singlePrice: string;
  erea: string;
  coefficient: string;
  value: string;
};

const columnResultTabel: ColumnsType<DataTable> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
  },
  {
    key: 2,
    title: "Nội dung",
    dataIndex: "content",
    render: (content) => (
      <>
        <Input value={content} />
      </>
    ),
  },
  {
    key: 3,
    title: "Quy hoạch",
    dataIndex: "quyHoach",
    render: (quyHoach) => (
      <>
        <Select
          allowClear
          defaultValue="a"
          style={{ width: 120 }}
          options={[
            { value: "a", label: "Không" },
            { value: "b", label: "Không" },
          ]}
        />
      </>
    ),
  },
  {
    key: 4,
    title: "Đơn giá lựa chọn theo mục đích",
    dataIndex: "priceGoal",
    render: (priceGoal) => (
      <>
        <Select
          allowClear
          defaultValue="a"
          style={{ width: 120 }}
          options={[
            { value: "a", label: "Đất ở tại đô thị" },
            { value: "b", label: "Đất ở tại đô thị" },
          ]}
        />
      </>
    ),
  },
  {
    key: 5,
    title: "Đơn giá",
    dataIndex: "singlePrice",
    render: (singlePrice) => (
      <>
        <Input value={singlePrice} />
      </>
    ),
  },
  {
    key: 6,
    title: "Diện tích (m²)",
    dataIndex: "erea",
    render: (erea) => (
      <>
        <Input value={erea} />
      </>
    ),
  },
  {
    key: 7,
    title: "Hệ số (%)",
    dataIndex: "coefficient",
    render: (coefficient) => (
      <>
        <Input value={coefficient} />
      </>
    ),
  },
  {
    key: 8,
    title: "Giá trị(đồng)",
    dataIndex: "value",
    render: (value) => (
      <>
        <Input value={value} />
      </>
    ),
  },
  {
    key: 9,
    title: "chức năng",
    align: "center",
    render: () => (
      <>
        <Button icon={<Icons.add />} type="text" />
      </>
    ),
  },
];

const dataResultTable: Array<DataTable> = [
  {
    key: 1,
    content: "QSDĐ - Đất OD",
    quyHoach: "",
    priceGoal: "",
    singlePrice: "81,501,123",
    coefficient: "100",
    erea: "98,18",
    index: 1,
    value: "8.000.000.876",
  },
  {
    key: 2,
    content: "QSDĐ - Đất OD",
    quyHoach: "",
    priceGoal: "",
    singlePrice: "81,501,123",
    coefficient: "100",
    erea: "98,18",
    index: 2,
    value: "8.000.000.876",
  },
  {
    key: 3,
    content: "QSDĐ - Đất OD",
    quyHoach: "",
    priceGoal: "",
    singlePrice: "81,501,123",
    coefficient: "100",
    erea: "98,18",
    index: 3,
    value: "8.000.000.876",
  },
  {
    key: 4,
    content: "QSDĐ - Đất OD",
    quyHoach: "",
    priceGoal: "",
    singlePrice: "81,501,123",
    coefficient: "100",
    erea: "98,18",
    index: 4,
    value: "8.000.000.876",
  },
  {
    key: 5,
    content: "QSDĐ - Đất OD",
    quyHoach: "",
    priceGoal: "",
    singlePrice: "81,501,123",
    coefficient: "100",
    erea: "98,18",
    index: 5,
    value: "8.000.000.876",
  },
  {
    key: 6,
    content: "QSDĐ - Đất OD",
    quyHoach: "",
    priceGoal: "",
    singlePrice: "81,501,123",
    coefficient: "100",
    erea: "98,18",
    index: 6,
    value: "8.000.000.876",
  },
];

const ResultTable = () => {
  return (
    <div className="result-table-container">
      <Table
        size="small"
        bordered={false}
        columns={columnResultTabel}
        dataSource={dataResultTable}
        pagination={{
          size: "default",
          defaultCurrent: 1,
          total: dataResultTable.length,
          pageSize: 10,
          current: 1,
          hideOnSinglePage: true,
        }}
      />
    </div>
  );
};

export default ResultTable;
