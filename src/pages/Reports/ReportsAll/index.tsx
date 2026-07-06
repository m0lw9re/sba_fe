import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { REPORT_ALL } from "routes/route.constant";
import FiltersReportAll from "./FilterReportsAll";
import { FilterReportAll } from "constant/types";
import TableReportAll from "./TableReportsAll";

const ReportsAll = () => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState<FilterReportAll>({
    startDate: null,
    endDate: null,
    approveEndDate: null,
    approveStartDate: null,
  });

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Báo cáo thống kê",
        path: "",
      },
      {
        label: "Báo cáo tổng hợp",
        path: "REPORT_ALL",
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [REPORT_ALL]);
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <FiltersReportAll filters={filter} setFilters={setFilter} />
        </div>
        <div className="table-category">
          <TableReportAll filters={filter} setFilters={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default ReportsAll;
