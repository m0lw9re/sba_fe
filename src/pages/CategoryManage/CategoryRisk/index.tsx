import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { CATEGORY_RISK } from "routes/route.constant";
import CategoryRiskFilter from "./components/CategoryRiskFilter";
import CategoryRiskTable from "./components/CategoryRiskTable";
import { FilterCategoryRiskType } from "constant/types";

const CateroryRisk = () => {
  const [filter, setFilter] = useState<FilterCategoryRiskType>({});
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "#",
      },
      {
        label: "Cảnh báo rủi ro",
        path: CATEGORY_RISK,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_RISK]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <CategoryRiskFilter filters={filter} setFilters={setFilter} />
        </div>
        <div className="table-category">
          <CategoryRiskTable filters={filter} setFilters={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default CateroryRisk;
