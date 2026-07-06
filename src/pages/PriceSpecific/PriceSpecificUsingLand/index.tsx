import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { PRICE_SPECIFIC_USING_LAND } from "routes/route.constant";
import { FilterSpecificPricesType } from "constant/types";
import PriceSpecificFilter from "pages/PriceSpecific/subcomponents/PriceSpecificFilter";
import PriceSpecificTable from "pages/PriceSpecific/PriceSpecificUsingLand/PriceSpecificTable";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";

const PriceSpecificUsingLand = () => {
  const [filters, setFilters] = useState<FilterSpecificPricesType>({
    assetType: ASSET_PRICES_SHARED_TYPE.PLAN_USING,
    approved: true,
    dateFrom: null,
    dateTo: null,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "BĐS",
        path: PRICE_SPECIFIC_USING_LAND,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_USING_LAND]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container" tabIndex={0}>
        <div style={{ marginBottom: "8px" }}>
          <PriceSpecificFilter
            filters={filters}
            setFilters={setFilters}
            assetType={ASSET_PRICES_SHARED_TYPE.PLAN_USING}
          />
        </div>
        <PriceSpecificTable filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default PriceSpecificUsingLand;
