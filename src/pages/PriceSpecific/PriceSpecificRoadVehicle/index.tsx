import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { FilterSpecificPricesType } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import PriceSpecificTable from "pages/PriceSpecific/PriceSpecificRoadVehicle/PriceSpecificTable";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PRICE_SPECIFIC_ROAD_VEHICLE } from "routes/route.constant";
import PriceSpecificVehicleFilter from "../subcomponents/PriceSpecificFilterVehicle";
import { ASSET_LV2 } from "constant/enums";

const PriceSpecificRoadVehicle = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<FilterSpecificPricesType>({
    assetType: ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE,
    approved: true,
    dateFrom: null,
    dateTo: null,
  });

  useEffect(() => {
    let breadCrumb = [
      {
        label: "PTVT đường bộ",
        path: PRICE_SPECIFIC_ROAD_VEHICLE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_ROAD_VEHICLE]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <PriceSpecificVehicleFilter
            filters={filters}
            setFilters={setFilters}
            assetType={ASSET_PRICES_SHARED_TYPE.ROAD_VEHICLE}
            assetLevelTwoId={ASSET_LV2.VEHICLE}
          />
        </div>
        <PriceSpecificTable filters={filters} setFilters={setFilters}/>
      </div>
    </div>
  );
};

export default PriceSpecificRoadVehicle;
