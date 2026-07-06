import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { FilterSpecificPricesType } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import PriceSpecificTable from "pages/PriceSpecific/PriceSpecificWarterWay/PriceSpecificTable";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PRICE_SPECIFIC_WATER_WAY } from "routes/route.constant";
import PriceSpecificVehicleFilter from "../subcomponents/PriceSpecificFilterVehicle";
import { ASSET_LV2 } from "constant/enums";

const PriceSpecificWaterWay = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<FilterSpecificPricesType>({
    assetType: ASSET_PRICES_SHARED_TYPE.WATERWAY_VEHICLE,
    approved: true,
    dateFrom: null,
    dateTo: null,
  });

  useEffect(() => {
    let breadCrumb = [
      {
        label: "PT đường thủy ",
        path: PRICE_SPECIFIC_WATER_WAY,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_WATER_WAY]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <PriceSpecificVehicleFilter
            filters={filters}
            setFilters={setFilters}
            assetType={ASSET_PRICES_SHARED_TYPE.WATERWAY_VEHICLE}
            assetLevelTwoId={ASSET_LV2.WATER_VEHICLE}
          />
        </div>
        <PriceSpecificTable filters={filters} setFilters={setFilters}/>
      </div>
    </div>
  );
};

export default PriceSpecificWaterWay;
