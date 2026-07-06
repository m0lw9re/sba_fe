import "./style.scss";
import { useState } from "react";
import { FilterReportCompletedFileDetail } from "constant/types";
import TableReportCompleteFileDetail from "./TableReportsCompleteFileDetail";
import ReportCompletedFileDetailFilter from "./FilterReportsComplteFileDetail";

const ReportCompletedFileDetailTDV = () => {
  const [filter, setFilter] = useState<FilterReportCompletedFileDetail>({dateFrom: null, dateTo: null});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportCompletedFileDetailFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <TableReportCompleteFileDetail filters={filter} setFilters={setFilter}/>
      </div>
    </div>
  );
};

export default ReportCompletedFileDetailTDV;
