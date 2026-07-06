import { useEffect, useState } from "react";
import { FilterSpecificPricesType } from "constant/types";
import { useDispatch } from "react-redux";
import { PRICE_SHARED_DENY } from "routes/route.constant";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { LOCAL_STORAGE_KEY } from "constant/enums";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";
import AssetListApprovalDenyFilter from "pages/PriceShared/AssetListAppovalDeny/AssetListApprovalDenyFilter";
import AssetListApprovalDenyTable from "pages/PriceShared/AssetListAppovalDeny/AssetListApprovalDenyTable";

const AssetListApprovalDeny= () => {

  const [filters, setFilters] = useState<FilterSpecificPricesType>({assetType: ASSET_PRICES_SHARED_TYPE.PLAN_USING, dateFrom: null, dateTo: null, approved: false});
  const dispatch = useDispatch();
  
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách chờ từ chối",
        path: PRICE_SHARED_DENY,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    localStorage.removeItem(LOCAL_STORAGE_KEY.PRICESHARED_COLLECTED);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SHARED_DENY]);

  return (
    <div style={{ width: "100%" }}> 
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <AssetListApprovalDenyFilter
            filters={filters}
            setFilter={setFilters}
          />
        </div>
        <AssetListApprovalDenyTable filters={filters} setFilters={setFilters}/>
      </div>
    </div>
  );
};

export default AssetListApprovalDeny;
