import "./style.scss";
import { useState } from "react";
import { FilterTotalReportDebt } from "constant/types";
import DebtReportsFilter from "./FilterTotalReportsDebt";
import TableReportDebt from "./DetailReportsDebt";
import BarChartReportTotalDebt from "./ChartReportsDebt/chartReportDebt";

const TotalReportDebt = () => {
  const [filter, setFilter] = useState<FilterTotalReportDebt>({dateFrom: null, dateTo: null});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <DebtReportsFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <BarChartReportTotalDebt filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <TableReportDebt filters={filter} setFilters={setFilter}/>
      </div>
    </div>
  );
};

export default TotalReportDebt;