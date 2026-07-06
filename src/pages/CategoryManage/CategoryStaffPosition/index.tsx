import { useState } from "react";
import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { CATEGORY_STAFF_POSITION } from "routes/route.constant";
import CategoryStaffPositionFilter from "./components/CategoryStaffPositionFilter/CategoryStaffPositionFilter";
import CategoryStaffPositionTable from "./components/CategoryStaffPositionTable/CategoryStaffPositionTable";
import { FilterCategoryStaffPositionType } from "constant/types";

const CategoryStaffPosition = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<FilterCategoryStaffPositionType>({});
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "#",
      },
      {
        label: "Vị trí",
        path: CATEGORY_STAFF_POSITION,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_STAFF_POSITION]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <CategoryStaffPositionFilter filter={filter} setFilter={setFilter} />
        </div>
        <div className="table-category">
          <CategoryStaffPositionTable filter={filter} setFilter={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default CategoryStaffPosition;
