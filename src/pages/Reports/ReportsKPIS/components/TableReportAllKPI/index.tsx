import "./style.scss";
import { useState } from "react";
import { FilterChartReportKPI } from "constant/types";
import ReportKPISFilter from "pages/Reports/ReportsKPIS/components/TableReportAllKPI/FilterReportAllKPI";
import TableAllReportKPIS from "pages/Reports/ReportsKPIS/components/TableReportAllKPI/Table";
import BarChartReportAllKpi from "pages/Reports/ReportsKPIS/components/TableReportAllKPI/ChartReportAllKPI";

const defaultFilter: FilterChartReportKPI = {
  month: "",
  year: new Date().getFullYear().toString(),
  staffId: null,
  dateFrom: null,
  dateTo: null,
  groupKpiId: null,
};

const ReportChartKPITable = () => {
  const [filter, setFilter] = useState<FilterChartReportKPI>(defaultFilter);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportKPISFilter
          filters={filter}
          setFilters={setFilter}
          defaultFilter={defaultFilter}
        />
      </div>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <BarChartReportAllKpi filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <TableAllReportKPIS filters={filter} setFilters={setFilter} />
      </div>
    </div>
  );
};

export default ReportChartKPITable;