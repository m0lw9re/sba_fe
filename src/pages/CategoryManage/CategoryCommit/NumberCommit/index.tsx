import "./style.scss";
import { useState } from "react";
import CategoryCommitFilters from "./FilterNumberCommit";
import CategoryCommitTable from "./TableNumberCommit";
import { FilterCategoryCommit } from "constant/types";

const NumberCommit = () => {
  const [filters, setFilters] = useState<FilterCategoryCommit>({});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <CategoryCommitFilters filters={filters} setFilters={setFilters} />
      </div>
      <div className="table-category">
        <CategoryCommitTable filters={filters} setFilters={setFilters}/>
      </div>
    </div>
  );
};

export default NumberCommit;
