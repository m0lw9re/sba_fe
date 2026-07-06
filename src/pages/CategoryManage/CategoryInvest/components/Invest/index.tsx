import { useRef, useState } from "react";
import CategoryInvestFilter from "./CategoryInvestFilter";
import CategoryInvestTable from "./CategoryInvestTable";

const CategoryInvest = () => {
  const [filter, setFilter] = useState<any>({});
  const filterRef = useRef<any>(null);
  const onKeyDown = (e: any) => {
    filterRef?.current?.onKeyDown(e);
  };
  return (
    <div className="page-container" onKeyDown={onKeyDown} tabIndex={0}>
      <div style={{ marginBottom: "8px" }}>
        <CategoryInvestFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <CategoryInvestTable filter={filter} setFilter={setFilter} />
      </div>
    </div>
  );
};

export default CategoryInvest;
