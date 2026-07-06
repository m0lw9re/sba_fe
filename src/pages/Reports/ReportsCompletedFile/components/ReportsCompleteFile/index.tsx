import "./style.scss";
import { useState } from "react";
import ReportCompletedFileAreaFilter from "./FilterReportCompletedFile";
import { FilterReportFileComplete } from "constant/types";
import TableReportCompletedFile from "./TableReportCompletedFile";
import BarChartReportCompleteFile from "./ChartReportCompletedFile/BarChartQuantityFile";

const ReportCompletedFileArea = () => {
  const [filter, setFilter] = useState<FilterReportFileComplete>({
    dateFrom: null,
    dateTo: null,
  });

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportCompletedFileAreaFilter
          filters={filter}
          setFilters={setFilter}
        />
      </div>
      <div className="table-category" style={{ marginBottom: "8px" }}>
        <BarChartReportCompleteFile filters={filter} setFilters={setFilter} />
      </div>
      <div className="table">
        <TableReportCompletedFile filters={filter} setFilters={setFilter} />
      </div>
    </div>
  );
};

export default ReportCompletedFileArea;
