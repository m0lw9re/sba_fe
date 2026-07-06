import KPIsByGroups from "pages/CategoryManage/CategoryKpi/components/KPIsByGroup/TableKPIs";
import "./style.scss";
import { useState } from "react";
import FiltersKPIs from "pages/CategoryManage/CategoryKpi/components/KPIsByGroup/Filter";

const TableKPIsInGroup = () => {
    const [filter, setFilter] = useState<any>();

  return (
    <div style={{ width: "100%" }}>
      <div className="Filter">
        <FiltersKPIs filter={filter} setFilter={setFilter} />
      </div>
      <div className="table-convert">
        <KPIsByGroups filter={filter} setFilter={setFilter}/>
      </div>
    </div>
  );
};

export default TableKPIsInGroup;
