import "./style.scss";
import { useState } from "react";
import { FilterFollowDebtByStaff } from "constant/types";
import ReportFollowDebtByStaffFilter from "./FilterFollowDebtByStaff";
import TableFollowDebtByStaff from "./TableFollowDebtByStaff";


const ReportFollowDebtByStaff = () => {
  const [filter, setFilter] = useState<FilterFollowDebtByStaff>({dateFrom: null, dateTo: null});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ReportFollowDebtByStaffFilter filters={filter} setFilters={setFilter} />
      </div>
      <div className="table-category">
          <TableFollowDebtByStaff filters={filter}setFilters={setFilter}/>
        </div>
    </div>
  );
};

export default ReportFollowDebtByStaff;