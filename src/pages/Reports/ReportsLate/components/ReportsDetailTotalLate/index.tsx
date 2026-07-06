import "./style.scss";
import { useState } from "react";
import { FilterReportDetailTotalLate } from "constant/types";
import ReportDetailTotalLateFilter from "./FilterReportsDetailTotalLate";
import TableReportDetailLate from "./TableReportsDetailTotalLate";


const ReportDetailTotalLate = () => {
  const [filter, setFilter] = useState<FilterReportDetailTotalLate>({startDate: null, endDate: null});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportDetailTotalLateFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-responsive">
        <TableReportDetailLate filters={filter} setFilters={setFilter}/>
      </div>
    </div>
  );
};

export default ReportDetailTotalLate;
