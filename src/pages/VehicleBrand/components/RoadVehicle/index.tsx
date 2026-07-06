import "./style.scss";
import { FC, useState } from "react";
import RoadVehicleFilter from "pages/VehicleBrand/components/RoadVehicle/RoadVehicleFilter";
import RoadVehicleTable from "pages/VehicleBrand/components/RoadVehicle/RoadVehicleTable";
import { FilterVehicleBrandType, VehicleBrandClassify } from "constant/types";

type Props = {
  type: VehicleBrandClassify;
};
const RoadVehicleBrand: FC<Props> = ({ type }) => {
  const [filter, setFilter] = useState<FilterVehicleBrandType>({
    type: type || 1,
    searchKey: "",
  });

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

export default RoadVehicleBrand;
