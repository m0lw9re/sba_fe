import "./style.scss";
import { useState } from "react";
import { FilterDebtComparison } from "constant/types";
import DebtComparisonFilter from "./FilterDebtComparison";
import TableDebtComparison from "./TableDebtComparison";

const ReportDebtComparison = () => {
  const [filter, setFilter] = useState<FilterDebtComparison>({dateFrom: null, dateTo: null});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <DebtComparisonFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <TableDebtComparison filters={filter} setFilters={setFilter}/>
      </div>
    </div>
  );
};

export default ReportDebtComparison;