import "./style.scss";
import { useState } from "react";
import WaterVehicleFilter from "./WaterVehicleFilter";
import WaterVehicleTable from "./WaterVehicleTable";

const RealEstateInfo = () => {
  const [filter, setFilter] = useState<any>({});
  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "8px" }} className="filter-category">
        <WaterVehicleFilter filter={filter} setFilter={setFilter} />
      </div>
      <div className="table-category">
        <WaterVehicleTable filter={filter} />
      </div>
    </div>
  );
};

export default RealEstateInfo;
