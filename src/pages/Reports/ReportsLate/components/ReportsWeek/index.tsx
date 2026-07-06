import "./style.scss";
import { useState } from "react";
import { FilterReportWeek } from "constant/types";
import TableReportsWeek from "./TableReportsWeek";
import BarChartReportWeek from "./ChartReportsWeek/chartReportsWeek";
import ReportWeekFilter from "./FilterReportsWeek";


const ReportWeek = () => {
  const [filter, setFilter] = useState<FilterReportWeek>({dateFrom: null, dateTo: null});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportWeekFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table" style={{ marginBottom: "8px" }}>
        <BarChartReportWeek filters={filter} setFilters={setFilter}/>
      </div>
      <div className="table-category">
        <TableReportsWeek filters={filter} setFilters={setFilter}/>
      </div>
    </div>
  );
};

export default ReportWeek;
