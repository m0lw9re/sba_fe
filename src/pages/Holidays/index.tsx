import { FiltersCategoryDayOffsType } from "constant/types/categories";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HOLIDAYS } from "routes/route.constant";
import HolidaysFilters from "./components/HolidaysFilters";
import Index from "./components/TableHolidays";

const CategoryHoliday = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<FiltersCategoryDayOffsType>({
    start: null,
    end: null,
  });

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "#",
      },
      {
        label: "Ngày nghỉ trong năm",
        path: HOLIDAYS,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [HOLIDAYS]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <HolidaysFilters filters={filter} setFilters={setFilter} />
        </div>
      </div>
      <Index filters={filter} setFilters={setFilter} />
    </div>
  );
};

export default CategoryHoliday;
