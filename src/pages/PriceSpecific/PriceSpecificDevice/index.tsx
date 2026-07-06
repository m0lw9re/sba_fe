import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import { FilterSpecificPricesType } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import PriceSpecificTable from "pages/PriceSpecific/PriceSpecificDevice/PriceSpecificTable";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PRICE_SPECIFIC_DEVICE } from "routes/route.constant";
import PriceSpecificVehicleFilter from "../subcomponents/PriceSpecificFilterVehicle";
import { ASSET_LV2 } from "constant/enums";

const PriceSpecificDevice = () => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState<FilterSpecificPricesType>({
    assetType: ASSET_PRICES_SHARED_TYPE.DEVICE,
    approved: true,
    dateFrom: null,
    dateTo: null,
  });

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Máy móc thiết bị",
        path: PRICE_SPECIFIC_DEVICE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_DEVICE]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <PriceSpecificVehicleFilter
            filters={filters}
            setFilters={setFilters}
            assetType={ASSET_PRICES_SHARED_TYPE.DEVICE}
            assetLevelTwoId={ASSET_LV2.MACHINE}
          />
        </div>
        <PriceSpecificTable filters={filters} setFilters={setFilters}/>
      </div>
    </div>
  );
};

export default PriceSpecificDevice;
