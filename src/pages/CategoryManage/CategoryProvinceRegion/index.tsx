import {setSelectedBeadCrumb} from "pages/App/store/appSlice";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {REGIONS_FUNCTION} from "routes/route.constant";
import {useCategoryRegions} from "utils/request";
import RegionsFunctionFilter from "./RegionsFunctionFilter";
import RegionsFunctionTable from "./RegionsFunctionTable";
import {CompanyBranchAndRegionsType} from "constant/types/common";
import {Empty, Row, Spin} from "antd";
import "./style.scss";

const RegionsFunction = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<{
    companyBranchId: string | null;
  }>({
    companyBranchId: null,
  });
  const [selectedBranch, setSelectedBranch] =
    useState<CompanyBranchAndRegionsType | null>();
  const {data, isLoading, error} = useCategoryRegions();
  const [dataSource, setDataSource] = useState<CompanyBranchAndRegionsType[]>(
    data || []
  );
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Gán tỉnh vào chi nhánh",
        path: REGIONS_FUNCTION,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [REGIONS_FUNCTION]);
  useEffect(() => {
    if (filters.companyBranchId && dataSource) {
      const findBranch = dataSource.find(
        (item: CompanyBranchAndRegionsType) =>
          item.companyBranchId === filters.companyBranchId
      );
      setSelectedBranch(findBranch);
    }
  }, [filters]);
  useEffect(() => {
    // set default value for filter in the first time load data
    if (!selectedBranch && data) {
      setFilters({
        companyBranchId: data[0].companyBranchId,
      });
    }
    setDataSource(data);
  }, [data]);
  if (isLoading) {
    return (
      <Row justify={"center"} style={{width: "100%", marginTop: "50px"}}>
        <Spin />
      </Row>
    );
  }
  if (error) {
    return <div>Đã có lỗi xảy ra</div>;
  }
  return (
    <div style={{width: "100%"}}>
      <div className="page-container">
        <div style={{marginBottom: "8px"}} className="regions-filter">
          <RegionsFunctionFilter filters={filters} setFilter={setFilters} />
        </div>
        <div className="regions-table">
          {selectedBranch ? (
            <RegionsFunctionTable data={selectedBranch} />
          ) : (
            <Empty description="Chọn chi nhánh" />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionsFunction;
