import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { REPORT_PERSONAL } from "routes/route.constant";
import PersonalReportsFilter from "./components/FilterPersonalReports";
import { FilterPersonalReports } from "constant/types";
import TablePersonalReport from "./components/TablePersonalReports";

const ReportsPersonal = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<FilterPersonalReports>({dateFrom: "2024-01-01"});
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Báo cáo thống kê",
        path: "",
      },
      {
        label: "Báo cáo cá nhân",
        path: "/reports/personal",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [REPORT_PERSONAL]);
  
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <PersonalReportsFilter filters={filter} setFilters={setFilter} />
        </div>
        <div className="table-category">
          <TablePersonalReport filters={filter} setFilters={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPersonal;