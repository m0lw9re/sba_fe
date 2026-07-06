import "./style.scss";
import { useState } from "react";
import { FilterReportTotalDebt } from "constant/types";
import { useDebtReport } from "utils/request";
import FilterTotalReportDebt from "pages/Reports/ReportsDebt/components/ReportsTotalDebt/FilterReportTotalDebt";
import TableReportTotalDebt from "pages/Reports/ReportsDebt/components/ReportsTotalDebt/TableReportTotalDebt";

const ReportTotalDebt = () => {
  const [filter, setFilter] = useState<FilterReportTotalDebt>({
    dateFrom: null,
    dateTo: null,
  });

  const reportCompleteFileTime = useDebtReport(filter);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <FilterTotalReportDebt filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <TableReportTotalDebt
          data={reportCompleteFileTime?.data?.data || []}
          filters={filter}
          setFilters={setFilter}
        />
      </div>
    </div>
  );
};

export default ReportTotalDebt;