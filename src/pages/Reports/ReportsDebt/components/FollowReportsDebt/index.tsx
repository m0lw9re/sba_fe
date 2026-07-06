import "./style.scss";
import { useState } from "react";
import { FilterFollowReportsDebt } from "constant/types";
import ReportDebtFollowFilter from "./FilterFollowReportsDebt";
import TableFollowDebtReport from "./TableFollowReportsDebt";


const ReportFollowDebt = () => {
  const [filter, setFilter] = useState<FilterFollowReportsDebt>({dateFrom: null, dateTo: null});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportDebtFollowFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
          <TableFollowDebtReport filters={filter} setFilters={setFilter} />
        </div>
    </div>
  );
};

export default ReportFollowDebt;