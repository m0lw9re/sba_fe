import PriceSpecificFilter from "pages/PriceSpecific/subcomponents/PriceSpecificFilter";
import PriceSpecificTable from "pages/PriceSpecific/PriceSpecificEstimate/PriceSpecificTable";
import { FilterSpecificPricesType } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PRICE_SPECIFIC_ESTIMATE_PRICE } from "routes/route.constant";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";

const PriceSpecificEstimate = () => {
  const [filters, setFilters] = useState<FilterSpecificPricesType>({
    assetType: ASSET_PRICES_SHARED_TYPE.ESTIMATE,
    approved: true,
    dateFrom: null,
    dateTo: null,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Dự toán",
        path: PRICE_SPECIFIC_ESTIMATE_PRICE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_ESTIMATE_PRICE]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <PriceSpecificFilter
            filters={filters}
            setFilters={setFilters}
            assetType={ASSET_PRICES_SHARED_TYPE.ESTIMATE}
          />
        </div>
        <PriceSpecificTable filters={filters} setFilters={setFilters}/>
      </div>
    </div>
  );
};

export default PriceSpecificEstimate;
