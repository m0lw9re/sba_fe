import "./style.scss";
import { useState } from "react";
import { FilterReportDetailWeek } from "constant/types";
import ReportDetailWeekFilter from "./FilterReportsDetailWeek";
import TableReportDetailWeek from "./TableReportsDetailWeek";


const ReportDetailWeek = () => {
  const [filter, setFilter] = useState<FilterReportDetailWeek>({startDate: null , endDate: null});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportDetailWeekFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-responsive">
        <TableReportDetailWeek filters={filter} setFilters={setFilter}/>
      </div>
    </div>
  );
};

export default ReportDetailWeek;
