import "pages/AppraisalFiles/style.scss";
import { CATEGORY_SLA } from "routes/route.constant";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import CategorySlaFilter from "./subcomponent/CategorySlaFilter";
import CategorySlaTable from "./subcomponent/CategorySlaTable";
import { FilterSlaType } from "constant/types/sla";

const CategorySla = () => {
  const [filters, setFilters] = useState<FilterSlaType>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "SLA",
        path: CATEGORY_SLA,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [CATEGORY_SLA]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <CategorySlaFilter filters={filters} setFilters={setFilters} />
        </div>
        <CategorySlaTable filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default CategorySla;
