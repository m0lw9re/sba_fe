import PriceSpecificFilter from "pages/PriceSpecific/subcomponents/PriceSpecificFilter";
import PriceSpecificTable from "pages/PriceSpecific/PriceSpecificProjectAsset/PriceSpecificTable";
import { FilterSpecificPricesType } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PRICE_SPECIFIC_PROJECT } from "routes/route.constant";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";

const PriceSpecificProjectAsset = () => {
  const [filters, setFilters] = useState<FilterSpecificPricesType>({
    assetType: ASSET_PRICES_SHARED_TYPE.PROJECT,
    approved: true,
    dateFrom: null, 
    dateTo: null,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Dự án",
        path: PRICE_SPECIFIC_PROJECT,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [PRICE_SPECIFIC_PROJECT]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <PriceSpecificFilter
            filters={filters}
            setFilters={setFilters}
            assetType={ASSET_PRICES_SHARED_TYPE.PROJECT}
          />
        </div>
        <PriceSpecificTable filters={filters} setFilters={setFilters}/>
      </div>
    </div>
  );
};

export default PriceSpecificProjectAsset;
