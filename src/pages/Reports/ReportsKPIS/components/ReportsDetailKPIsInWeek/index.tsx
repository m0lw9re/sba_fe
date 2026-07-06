import "./style.scss";
import { useState } from "react";
import { FilterReportDetailKPIInWeek } from "constant/types";
import KPISWeekReportFilter from "./FilterDetailKPISInWeek";
import TableReportKPIInWeek from "./TableDetailKPISInWeek";

const defaultFilter: FilterReportDetailKPIInWeek = {
  staffId: null,
  groupKpiId: null,
  dateFrom: null,
  dateTo: null,
  appraisalUnit: null,
};

const ReportKPISInWeek = () => {
  const [filter, setFilter] = useState<FilterReportDetailKPIInWeek>(defaultFilter);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <KPISWeekReportFilter filters={filter} setFilters={setFilter} defaultFilter={defaultFilter} />
      </div>
      <div className="table-category">
        <TableReportKPIInWeek filters={filter} setFilters={setFilter}/>
      </div>
    </div>
  );
};

export default ReportKPISInWeek;