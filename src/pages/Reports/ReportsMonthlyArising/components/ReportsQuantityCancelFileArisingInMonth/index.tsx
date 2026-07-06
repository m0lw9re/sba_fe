import "./style.scss";
import { useState } from "react";
import { FilterQuantityCancelFileArisingInMonth } from "constant/types";
import QuantityCancelFileArisingInMonthFilter from "./FilterReportsQuantityCancelFileArisingInMonth";
import TableReportQuantityCancelFileArisingMonth from "./TableReportsQuantityCancelFileArisingInMonth";

const QuantityCancelFileArisingInMonth = () => {
  const [filter, setFilter] = useState<FilterQuantityCancelFileArisingInMonth>({});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <QuantityCancelFileArisingInMonthFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
        <TableReportQuantityCancelFileArisingMonth filters={filter} setFilters={setFilter}/>
      </div>
    </div>
  );
};

export default QuantityCancelFileArisingInMonth;
