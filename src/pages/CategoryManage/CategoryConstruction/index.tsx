/* eslint-disable react-hooks/exhaustive-deps */
import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { CATEGORY_CONSTRUCTION } from "routes/route.constant";
import CategoryRiskFilter from "./components/CategoryConstructionFilter";
import CategoryRiskTable from "./components/CategoryConstructionTable";
import { FilterCategoryRiskType } from "constant/types";

const CategoryConstruction = () => {
  const [filter, setFilter] = useState<FilterCategoryRiskType>({});
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Mô tả đặc tính kỹ thuật",
        path: CATEGORY_CONSTRUCTION,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_CONSTRUCTION]);

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

export default CategoryConstruction;
