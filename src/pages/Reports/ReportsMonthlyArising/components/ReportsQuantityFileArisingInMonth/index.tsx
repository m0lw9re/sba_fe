import "./style.scss";
import { useState } from "react";
import { FilterQuantityFileArisingInMonth } from "constant/types";
import QuantityFileArisingInMonthFilter from "./FilterReportsQuantityFileArisingInMonth";
import TableReportQuantityFileArisingMonth from "./DetailReportsQuantityFileArisingInMonth";
import TableLeft from "./TableLeft";
import TableRight from "pages/Reports/ReportsMonthlyArising/components/ReportsQuantityFileArisingInMonth/TableRight";

const QuantityFileArisingInMonth = () => {
  const [filter, setFilter] = useState<FilterQuantityFileArisingInMonth>({
    roleCode: null,
    approveEndDate: null,
    approveStartDate: null,
    startDate: null,
    endDate: null,
  });

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <QuantityFileArisingInMonthFilter
          filters={filter}
          setFilters={setFilter}
        />
      </div>
      <div className="table-category" style={{ marginBottom: "8px" }}>
        <TableReportQuantityFileArisingMonth
          filters={filter}
          setFilters={setFilter}
        />
      </div>
      <div className="tableDetail" style={{display: "flex"}}>
        <div className="table" style={{width: "50%"}}>
          <TableLeft filters={filter} setFilters={setFilter} />
        </div>
        <div className="table" style={{width: "50%", marginLeft: "8px"}}>
          <TableRight filters={filter} setFilters={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default QuantityFileArisingInMonth;
