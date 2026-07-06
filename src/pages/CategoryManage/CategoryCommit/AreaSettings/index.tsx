import { useCallback, useEffect, useState } from "react";
import "./style.scss";
import FilterAreaSettings from "pages/CategoryManage/CategoryCommit/AreaSettings/FilterAreaSettings";
import { AreaSettingByIdType, FilterAreaSettingType } from "constant/types";
import AreaSettingTable from "pages/CategoryManage/CategoryCommit/AreaSettings/AreaSettingTable";
import { Empty, Row, Spin } from "antd";
import { areaSettingApi } from "apis/area";

const AreaSettings = () => {
  const [filters, setFilters] = useState<FilterAreaSettingType>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<AreaSettingByIdType | null>(
    null
  );

  const getAreaProvince = useCallback(async () => {
    if (filters?.areaOption && filters?.provinceCode) {
      setIsLoading(true);
      const res = await areaSettingApi.getAreaProvince(
        filters.provinceCode,
        filters.areaOption
      );
      setDataSource(res?.data?.data);
    }
    setIsLoading(false);
  }, [filters, setDataSource]);

  const handleGetDataSource = useCallback(() => {
    getAreaProvince();
  }, [getAreaProvince, isLoading]);

  useEffect(() => {
    handleGetDataSource();
  }, [JSON.stringify(filters)]);

  if (isLoading) {
    return (
      <Row justify={"center"} style={{ width: "100%", marginTop: "50px" }}>
        <Spin />
      </Row>
    );
  }
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="area-setting-filter">
          <FilterAreaSettings filters={filters} setFilters={setFilters} />
        </div>
        <div className="area-setting-table">
          {dataSource ? (
            <AreaSettingTable data={dataSource} filters={filters} />
          ) : (
            <Empty description="Chọn địa bàn và tỉnh" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaSettings;
