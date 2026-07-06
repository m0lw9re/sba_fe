import { useState } from "react";
import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { CATEGORY_DEPARTMENT } from "routes/route.constant";
import CategoryDepartmentFilter from "./components/CategoryDepartmentFilter/CategoryDepartmentFilter";
import CategoryDepartmentTable from "./components/CategoryDepartmentTable/CategoryDepartmentTable";
import { FilterCategoryDepartmentType } from "constant/types";

const CategoryDepartment = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<FilterCategoryDepartmentType>({});
  useEffect(() => {
    let breadCrumb = [
      { label: "Danh mục", path: "#" },
      {
        label: "Phòng ban",
        path: CATEGORY_DEPARTMENT,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_DEPARTMENT]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <CategoryDepartmentFilter filter={filter} setFilter={setFilter} />
        </div>
        <div className="table-category">
          <CategoryDepartmentTable filter={filter} setFilter={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default CategoryDepartment;
