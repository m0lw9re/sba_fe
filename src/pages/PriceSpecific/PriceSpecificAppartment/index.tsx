import PriceSpecificFilter from "pages/PriceSpecific/subcomponents/PriceSpecificFilter";
import PriceSpecificTable from "pages/PriceSpecific/PriceSpecificAppartment/PriceSpecificTable";
import { FilterSpecificPricesType } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { PRICE_SPECIFIC_APPARTMENT } from "routes/route.constant";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";

const PriceSpecificAppartment = () => {
  const [filters, setFilters] = useState<FilterSpecificPricesType>({
    assetType: ASSET_PRICES_SHARED_TYPE.APARTMENT,
    approved: true,
    dateFrom: null,
    dateTo: null,
  });
  const filterRef = useRef<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "CHCC",
        path: PRICE_SPECIFIC_APPARTMENT,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_APPARTMENT]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <PriceSpecificFilter
            filters={filters}
            setFilters={setFilters}
            assetType={ASSET_PRICES_SHARED_TYPE.APARTMENT}
          />
        </div>
        <PriceSpecificTable filters={filters} setFilters={setFilters} />
      </div>
    </div>
  );
};

export default PriceSpecificAppartment;
