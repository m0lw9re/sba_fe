import { FilterReportDetailKPIInMonth } from "constant/types/reports";
import { useState } from "react";
import KPISMonthReportFilter from "./FilterDeailKPISInMonth";
import TableReportKPIInMonth from "./TableDetailKPISInMonth";
import "./style.scss";

const defaultFilter: FilterReportDetailKPIInMonth = {
  isCompleteKpi: null,
  month: "",
  year: new Date().getFullYear().toString(),
  StaffId: null,
  groupKpiId: null,
  appraisalUnit: null,
};

const ReportKPISInMonth = () => {
  const [filter, setFilter] =
    useState<FilterReportDetailKPIInMonth>(defaultFilter);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <KPISMonthReportFilter
          filters={filter}
          setFilters={setFilter}
          defaultFilter={defaultFilter}
        />
      </div>
      <div className="table-category">
        <TableReportKPIInMonth filters={filter} setFilters={setFilter} />
      </div>
    </div>
  );
};

export default ReportKPISInMonth;