import "./style.scss";
import { useState } from "react";
import ReportCompletedFileDetailFilter from "./FilterReportsCompleteFileTime";
import { FilterReportCompletedFileTime } from "constant/types";
import TableReportCompleteFileDetail from "./TableReportsCompleteFileTime";
import TableReportCompletedFile from "./ChartTableReportsCompleteFile";
import { useReportsCompleteFileTime } from "utils/request";

const ReportCompletedFileDetail = () => {
  const [filter, setFilter] = useState<FilterReportCompletedFileTime>({
    dateFrom: null,
    dateTo: null,
  });

  const reportCompleteFileTime = useReportsCompleteFileTime(filter);

  const reportCompleteFileData = reportCompleteFileTime?.data?.data || [];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportCompletedFileDetailFilter
          filters={filter}
          setFilters={setFilter}
        />
      </div>
      <div className="table" style={{ marginBottom: "8px" }}>
        <TableReportCompletedFile data={reportCompleteFileData} />
      </div>
      <div className="table-category">
        <TableReportCompleteFileDetail
          data={reportCompleteFileData}
          filters={filter}
          setFilters={setFilter}
        />
      </div>
    </div>
  );
};

export default ReportCompletedFileDetail;
