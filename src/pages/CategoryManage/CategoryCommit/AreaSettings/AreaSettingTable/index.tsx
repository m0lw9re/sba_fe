import { AreaSettingByIdType, FilterAreaSettingType } from "constant/types";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Card, Row, Space, Table, message } from "antd";
import ButtonCustom from "components/ButtonCustom";
import Icons from "assets/icons";
import AreaSettingGroupItem from "pages/CategoryManage/CategoryCommit/AreaSettings/AreaSettingTable/AreaSettingGroupItem";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { areaSettingApi } from "apis/area";

type Props = {
  filters: FilterAreaSettingType;
  data: AreaSettingByIdType;
};

const AreaSettingTable: React.FC<Props> = ({ filters, data }) => {
  const [dataSource, setDataSource] = useState<AreaSettingByIdType | any>(
    {} as AreaSettingByIdType
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [dataTable, setDataTable] = useState<any>([]);
  const [selectedRowInGroup, setSelectedRowInGroup] = useState<Array<string>>(
    []
  );
  const [selectedRowUnGroup, setSelectedRowUnGroup] = useState<Array<string>>(
    []
  );

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "Tỉnh không thuộc địa bàn",
      dataIndex: "provincesUnGroup",
    },
    {
      key: 2,
      align: "center",
      title: (
        <Row justify={"center"}>
          <ButtonCustom
            bgColor="#2862AF"
            size={"small"}
            type="primary"
            icon={<Icons.sync />}
            onClick={() => {
              setDataSource(data);
              setSelectedRowInGroup([]);
              setSelectedRowUnGroup([]);
            }}
          />
        </Row>
      ),
      dataIndex: "syncButton",
    },
    {
      key: 3,
      title: "Tỉnh thuộc địa bàn",
      dataIndex: "provincesInGroup",
    },
  ];

  const handleMoveToLeft = () => {
    if (!dataSource) return;

    const inside = dataSource?.inside
      .filter((item: any) => !selectedRowInGroup.includes(item.code))
      .map((item: any) => ({
        ...item,
      }));
    const outside = dataSource?.outside.concat(
      dataSource?.inside
        .filter((item: any) => selectedRowInGroup.includes(item.code))
        .map((item: any) => ({
          ...item,
        }))
    );
    setSelectedRowInGroup([]);
    setDataSource({ ...dataSource, inside, outside });
  };

  const handleMoveToRight = () => {
    if (!dataSource) return;

    const outside = dataSource?.outside
      .filter((item: any) => !selectedRowUnGroup.includes(item.code))
      .map((item: any) => ({ ...item }));
    const inside = dataSource?.inside.concat(
      dataSource?.outside
        .filter((item: any) => selectedRowUnGroup.includes(item.code))
        .map((item: any) => ({ ...item }))
    );
    setSelectedRowUnGroup([]);
    setDataSource({ ...dataSource, inside, outside });
  };

  const dataTableRender = [
    {
      provincesUnGroup: (
        <AreaSettingGroupItem
          type="not-in"
          data={dataSource?.outside}
          selectedRowKeys={selectedRowUnGroup}
          onSelectRow={setSelectedRowUnGroup}
        />
      ),
      provincesInGroup: (
        <AreaSettingGroupItem
          type="in"
          data={dataSource?.inside}
          selectedRowKeys={selectedRowInGroup}
          onSelectRow={setSelectedRowInGroup}
        />
      ),
      syncButton: (
        <Row align={"middle"} justify={"center"}>
          <Space direction="vertical">
            <ButtonCustom
              bgColor="#17A109"
              size="small"
              shape="circle"
              icon={<Icons.doubleRight style={{ color: "#FFFFFF" }} />}
              disabled={selectedRowUnGroup.length === 0}
              onClick={handleMoveToRight}
            />
            <ButtonCustom
              bgColor="#F25B60"
              size="small"
              shape="circle"
              icon={<Icons.doubleLeft style={{ color: "#FFFFFF" }} />}
              disabled={selectedRowInGroup.length === 0}
              onClick={handleMoveToLeft}
            />
          </Space>
        </Row>
      ),
    },
  ];

  const handleUpdateBranch = async () => {
    setLoading(true);
    try {
      const dataUpdate = {
        ...dataSource,
        districtIds: dataSource?.inside?.map((item: any) => item?.code) || [],
      };
      const res = await areaSettingApi.updateAreaProvince(dataUpdate);
      if (res.data.code === 200) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  useEffect(() => {
    setDataTable(dataTableRender);
  }, [dataSource, selectedRowInGroup, selectedRowUnGroup]);

  return (
    <div className="area-setting-table-container">
      <Card className="card-container" size="small">
        <Row justify={"space-between"} align={"middle"}>
          <CardTitleCustomUpdate title="Chi tiết địa bàn" />
          <ButtonCustom
            label="Lưu"
            bgColor="#2862AF"
            type="primary"
            onClick={handleUpdateBranch}
            loading={loading}
          />
        </Row>
        <div style={{ width: "100" }} className="area-setting-table">
          <Table
            size="small"
            className="table-custom"
            dataSource={dataTable}
            columns={columns}
            bordered={true}
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
};

export default AreaSettingTable;
