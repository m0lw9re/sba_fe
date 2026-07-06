import "./style.scss";
import { useState } from "react";
import { FilterChartQuantityFileArising } from "constant/types";
import ChartQuantityFileArisingInMonthFilter from "./FilterChartQuantityFileArisingInMonth";
import BarChartArising from "./BarChartArising/BarChartQuantityFile";
import PieChartArising from "./PieChartArising/PieChartQuantityFile";

const ChartQuantityFileArisingInMonth = () => {
  const [filter, setFilter] = useState<FilterChartQuantityFileArising>({});

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <ChartQuantityFileArisingInMonthFilter
          filters={filter}
          setFilters={setFilter}
        />
      </div>
      <div className="table-category" style={{ marginBottom: "8px" }}>
        <PieChartArising  filters={filter} setFilters={setFilter}/>
      </div>
      <div className="table-category" style={{ marginBottom: "8px" }}>
        <BarChartArising filters={filter} setFilters={setFilter} />
      </div>
    </div>
  );
};

export default ChartQuantityFileArisingInMonth;
