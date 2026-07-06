import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CATEGORY_FEE } from "routes/route.constant";
import "./style.scss";
import FilterFeeSchedule from "pages/CategoryManage/CategoryFee/components/CategoryFeeFilter";
import { feeScheduleFilter } from "constant/types";
import CategoryFeeSchedule from "pages/CategoryManage/CategoryFee/components/CategoryFeeTable";

const CategoryFee = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<feeScheduleFilter>({});

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục",
        path: "#",
      },
      {
        label: "Biểu phí định giá",
        path: CATEGORY_FEE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_FEE]);

  return (
    <div className="page-container">
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <FilterFeeSchedule filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <CategoryFeeSchedule filters={filter} setFilters={setFilter} />
      </div>
    </div>
  );
};

export default CategoryFee;
