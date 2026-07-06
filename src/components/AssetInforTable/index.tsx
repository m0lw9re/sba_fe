import { Table, Input } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import "pages/ExpertiseAssetInfo/subcomponents/LandInfor/subcomponents/AssetInforTable/style.scss";

type DataTable = {
  key: number;
  attribute: string;
  HSPL: string;
  real: string;
};

const columnAddressInforTabel: ColumnsType<DataTable> = [
  {
    key: 1,
    title: "Đặc điểm",
    dataIndex: "attribute",
  },
  {
    key: 2,
    title: "HSPL",
    dataIndex: "HSPL",
    render: (provinceName) => (
      <>
        <Input value={provinceName} />
      </>
    ),
  },
  {
    key: 3,
    title: "Thực tế",
    dataIndex: "real",
    render: (real) => (
      <>
        <Input value={real} />
      </>
    ),
  },
];

const dataAssetInforTable: Array<DataTable> = [
  {
    key: 1,
    attribute: "Hướng chính",
    HSPL: "Bắc",
    real: "Bắc",
  },
  {
    key: 2,
    attribute: "Hình dạng",
    HSPL: "Cân đối",
    real: "Cân đối",
  },
  {
    key: 3,
    attribute: "Số mặt tiền/ mặt thoáng",
    HSPL: "1",
    real: "1",
  },
  {
    key: 4,
    attribute: "Kích thước mặt tiền(m)",
    HSPL: "5.6",
    real: "5.6",
  },
  {
    key: 5,
    attribute: "Kích thước chiều dài",
    HSPL: "17.2",
    real: "17.2",
  },
];

const AssetInforTable = () => {
  return (
    <div className="asset-infor-table-container">
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

export default AssetInforTable;
