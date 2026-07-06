import "./style.scss";
import { Card } from "antd";
import { useState } from "react";
import RoadVehicleFilter from "./RoadVehicleFilter";
import RoadVehicleTable from "./RoadVehicleTable";

const RealEstateInfo = () => {
  const [filter, setFilter] = useState<any>({});
  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <RoadVehicleFilter filter={filter} setFilter={setFilter} />
      </div>
      <div className="table-category">
        <RoadVehicleTable filter={filter} />
      </div>
    </div>
  );
};

export default RealEstateInfo;
