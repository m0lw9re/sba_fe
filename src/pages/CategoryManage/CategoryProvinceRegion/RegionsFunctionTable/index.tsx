import { Card, Row, Space, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { branchsApi } from "apis/branch";
import Icons from "assets/icons";
import ButtonCustom from "components/ButtonCustom";
import CardTitleCustomUpdate from "components/CardTitleCustomUpdate";
import { CompanyBranchAndRegionsType } from "constant/types/common";
import { useEffect, useState } from "react";
import { useCategoryRegions } from "utils/request";
import RegionsFunctionGroupItem from "./RegionsFunctionGroupItem";
import { BUTTON_CODES } from "constant/common";

type Props = {
  data: CompanyBranchAndRegionsType;
};

const RegionsFunctionTable = ({ data }: Props) => {
  const [dataSource, setDataSource] = useState<CompanyBranchAndRegionsType>(
    {} as CompanyBranchAndRegionsType
  );
  const { mutate } = useCategoryRegions();
  const [loading, setLoading] = useState<boolean>(false);

  const [dataTable, setDataTable] = useState<any>([]);
  const [selectedRowInGroup, setSelectedRowInGroup] = useState<string[]>([]);
  const [selectedRowUnGroup, setSelectedRowUnGroup] = useState<string[]>([]);

  const columns: ColumnsType<any> = [
    {
      key: 1,
      title: "Tỉnh không thuộc chi nhánh",
      dataIndex: "regionsUnGroup",
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
      title: "Tỉnh thuộc chi nhánh",
      dataIndex: "regionsInGroup",
    },
  ];

  const handleMoveToLeft = () => {
    // tỉnh không thuộc => thuộc
    if (!dataSource) return;

    const provincesBelong = dataSource.provincesBelong
      .filter((item) => !selectedRowInGroup.includes(item.code))
      .map((item) => ({
        ...item,
        companyBranchCode: dataSource.code,
      }));

    //
    const provincesNotBelong = dataSource.provincesNotBelong.concat(
      dataSource.provincesBelong
        .filter((item) => selectedRowInGroup.includes(item.code))
        .map((item) => ({
          ...item,
          companyBranchCode: null,
        }))
    );
    setSelectedRowInGroup([]);
    setDataSource({ ...dataSource, provincesBelong, provincesNotBelong });
  };
  const handleMoveToRight = () => {
    // tỉnh thuộc => không thuộc
    if (!dataSource) return;
    const provincesNotBelong = dataSource.provincesNotBelong
      .filter((item) => !selectedRowUnGroup.includes(item.code))
      .map((item) => ({
        ...item,
        companyBranchCode: null,
      }));

    const provincesBelong = dataSource.provincesBelong.concat(
      dataSource.provincesNotBelong
        .filter((item) => selectedRowUnGroup.includes(item.code))
        .map((item) => ({
          ...item,
          companyBranchCode: dataSource.code,
        }))
    );
    setSelectedRowUnGroup([]);
    setDataSource({ ...dataSource, provincesBelong, provincesNotBelong });
  };

  const dataTableRender = [
    {
      regionsUnGroup: (
        <RegionsFunctionGroupItem
          type="not-in"
          data={dataSource.provincesNotBelong || []}
          selectedRowKeys={selectedRowUnGroup}
          onSelectRow={setSelectedRowUnGroup}
        />
      ),
      regionsInGroup: (
        <RegionsFunctionGroupItem
          type="in"
          data={dataSource.provincesBelong || []}
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
      const res = await branchsApi.updateProvinceInBranch(dataSource);
      if (res.data.code === 200) {
        message.success(res.data.message);
        mutate();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {}
    setLoading(false);
  };

  useEffect(() => {
    if (!data.provincesBelong && !data.provincesNotBelong) return;
    setDataSource(data);
  }, [data]);
  useEffect(() => {
    setDataTable(dataTableRender);
  }, [dataSource, selectedRowInGroup, selectedRowUnGroup]);

  return (
    <div className="user-function-table-container">
      <Card className="card-container" size="small">
        <Row justify={"space-between"} align={"middle"}>
          <CardTitleCustomUpdate title="Chi tiết chi nhánh" />
          <ButtonCustom
            label="Lưu"
            bgColor="#2862AF"
            type="primary"
            onClick={handleUpdateBranch}
            loading={loading}
            code={BUTTON_CODES.dm_gtvcn_luu}
          />
        </Row>
        <div style={{ width: "100" }} className="user-function-table">
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

export default RegionsFunctionTable;
