import "./style.scss";
import { useState } from "react";
import { FilterReportDebtMonthYear } from "constant/types";
import ReportDebtMonthYearFilter from "./FilterReportsDebtMonth-Year";
import BarChartReportDebtMonthYear from "./ChartReportsDebtMonth-Year";
import TableDebtMonthYear from "./TableReportsDebtMonth-Year";

const ReportDebtMonthYear = () => {
  const [filter, setFilter] = useState<FilterReportDebtMonthYear>({dateFrom: null, dateTo: null});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportDebtMonthYearFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <TableDebtMonthYear filters={filter} setFilters={setFilter}/>
      </div>
    </div>
  );
};

export default ReportDebtMonthYear;