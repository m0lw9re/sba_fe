import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { CATEGORY_REGIONS } from "routes/route.constant";
import { FilterCategoryRegionsType } from "constant/types/categoryregions";
import CategoryRegionsFilter from "./components/CategoryRegionsFilter/CategoryRegionsFilter";
import CategoryRegionsTable from "./components/CategoryRegionsTable/CategoryRegionsTable";

const CategoryRegions = () => {
  const [filter, setFilter] = useState<FilterCategoryRegionsType>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách chi nhánh",
        path: CATEGORY_REGIONS,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_REGIONS]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <CategoryRegionsFilter filters={filter} setFilter={setFilter} />
        </div>
        <div className="table-category">
          <CategoryRegionsTable filters={filter} setFilters={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default CategoryRegions;
