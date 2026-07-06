import StaffByGroups from "pages/CategoryManage/CategoryKpi/components/StaffByGroup/TableStaff";
import "./style.scss";
import { useState } from "react";
import FiltersStaff from "pages/CategoryManage/CategoryKpi/components/StaffByGroup/FIlter";

const TableStaffInGroup = () => {
    const [filter, setFilter] = useState<any>();

  return (
    <div style={{ width: "100%" }}>
      <div className="Filter">
        <FiltersStaff filter={filter} setFilter={setFilter} />
      </div> 
      <div className="table-staff" style={{marginTop : "8px"}}>
        <StaffByGroups filter={filter} setFilter={setFilter}/>
      </div>
    </div>
  );
};

export default TableStaffInGroup;
