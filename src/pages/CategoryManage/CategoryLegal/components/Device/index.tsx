import "./style.scss";
import { Card } from "antd";
import { useState } from "react";
import DeviceFilter from "./DeviceFilter";
import DeviceTable from "./DeviceTable";

const RealEstateInfo = () => {
  const [filter, setFilter] = useState<any>({});
  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <DeviceFilter filter={filter} setFilter={setFilter} />
      </div>
      <div className="table-category">
        <DeviceTable filter={filter} />
      </div>
    </div>
  );
};

export default RealEstateInfo;
