import { Table, Input, Select, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import "pages/ExpertisePriceAsset/subcomponents/MethodTable/style.scss";
import { Link } from "react-router-dom";
import Icons from "assets/icons";

type DataTable = {
  key: number;
  index: number;
  goalUsage: string;
  priceMethod: string;
  singlePrice: string;
};

const columnAddressInforTabel: ColumnsType<DataTable> = [
  {
    key: 1,
    title: "STT",
    dataIndex: "index",
  },
  {
    key: 2,
    title: "Mục đích sử dụng đất",
    dataIndex: "goalUsage",
    render: (goalUsage) => (
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
    key: 3,
    title: "Phương pháp định giá",
    dataIndex: "priceMethod",
    render: (priceMethod) => (
      <>
        <Select
          allowClear
          defaultValue="a"
          style={{ width: 120 }}
          options={[
            { value: "a", label: "PP so sánh" },
            { value: "b", label: "PP so sánh" },
          ]}
        />
      </>
    ),
  },
  {
    key: 4,
    title: "Đơn giá(đồng/m²)",
    dataIndex: "singlePrice",
    render: (singlePrice) => (
      <>
        <Input value={singlePrice} />
      </>
    ),
  },
  {
    key: 5,
    title: "Chi tiết",
    align: "center",
    render: () => (
      <>
        <Link to={""}>Chi tiết</Link>
      </>
    ),
  },
  {
    key: 6,
    title: "Chức năng",
    align: "center",
    render: () => (
      <>
        <Button icon={<Icons.add />} type="text" />
      </>
    ),
  },
];

const dataAssetInforTable: Array<DataTable> = [
  {
    key: 1,
    goalUsage: "",
    priceMethod: "",
    singlePrice: "23324.34343",
    index: 1,
  },
  {
    key: 2,
    goalUsage: "",
    priceMethod: "",
    singlePrice: "23324.34343",
    index: 2,
  },
  {
    key: 3,
    goalUsage: "",
    priceMethod: "",
    singlePrice: "23324.34343",
    index: 3,
  },
  {
    key: 3,
    goalUsage: "",
    priceMethod: "",
    singlePrice: "23324.34343",
    index: 1,
  },
  {
    key: 4,
    goalUsage: "",
    priceMethod: "",
    singlePrice: "23324.34343",
    index: 4,
  },
];

const MethodTable = () => {
  return (
    <div className="method-table-container">
      <Table
        size="small"
        bordered={false}
        columns={columnAddressInforTabel}
        dataSource={dataAssetInforTable}
        pagination={{
          size: "default",
          defaultCurrent: 1,
          total: dataAssetInforTable.length,
          pageSize: 10,
          current: 1,
          hideOnSinglePage: true,
        }}
      />
    </div>
  );
};

export default MethodTable;
