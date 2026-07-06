import "./style.scss";
import { useState } from "react";
import { FilterReportTotalLate } from "constant/types";
import ReportTotalLateFilter from "./FilterReportsTotalLate";
import TableReportTotalLate from "./TableReportsTotalLate";
import BarChartReportTotalLate from "./ChartReportsTotalLate/chartReportTotalLate";

const ReportTotalLate = () => {
  const [filter, setFilter] = useState<FilterReportTotalLate>({
    dateFrom: null,
    dateTo: null,
  });

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportTotalLateFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table" style={{ marginBottom: "8px" }}>
        <BarChartReportTotalLate filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <TableReportTotalLate filters={filter} setFilters={setFilter} />
      </div>
    </div>
  );
};

export default ReportTotalLate;
