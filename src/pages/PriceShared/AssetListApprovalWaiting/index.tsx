import { useEffect, useState } from "react";
import { FilterSpecificPricesType } from "constant/types";
import { useDispatch } from "react-redux";
import { PRICE_SHARED_PENDIND } from "routes/route.constant";
import AssetListApprovalWaitingFilter from "pages/PriceShared/AssetListApprovalWaiting/AssetListApprovalWaitingFilter";
import AssetListApprovalWaitingTable from "pages/PriceShared/AssetListApprovalWaiting/AssetListApprovalWaitingTable";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { LOCAL_STORAGE_KEY } from "constant/enums";
import { ASSET_PRICES_SHARED_TYPE } from "constant/common";

const AssetListApprovalWaiting = () => {
  const [filters, setFilters] = useState<FilterSpecificPricesType>({assetType: ASSET_PRICES_SHARED_TYPE.PLAN_USING, dateFrom: null, dateTo: null});
  const dispatch = useDispatch();
  
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách chờ phê duyệt",
        path: PRICE_SHARED_PENDIND,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
    localStorage.removeItem(LOCAL_STORAGE_KEY.PRICESHARED_COLLECTED);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PRICE_SHARED_PENDIND]);

  return (
    <div style={{ width: "100%" }}> 
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <AssetListApprovalWaitingFilter
            filters={filters}
            setFilter={setFilters}
          />
        </div>
        <AssetListApprovalWaitingTable filters={filters} setFilters={setFilters}/>
      </div>
    </div>
  );
};

export default AssetListApprovalWaiting;
