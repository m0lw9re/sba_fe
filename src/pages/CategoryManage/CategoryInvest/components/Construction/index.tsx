import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useRef, useState } from "react";
import CategoryConstructionFilter from "./CategoryConstructionFilter";
import CategoryConstructionTable from "./CategoryConstructionTable";

const CategoryConstruction = () => {
  const [filter, setFilter] = useState<any>({});
  const filterRef = useRef<any>(null);
  const onKeyDown = (e: any) => {
    filterRef?.current?.onKeyDown(e);
  };
  return (
    <div className="page-container" onKeyDown={onKeyDown} tabIndex={0}>
      <div style={{ marginBottom: "8px" }}>
        <CategoryConstructionFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <CategoryConstructionTable filter={filter} setFilter={setFilter} />
      </div>
    </div>
  );
};

export default CategoryConstruction;
