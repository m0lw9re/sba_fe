import { lazy } from "react";
import { PRICE_SHARED_PENDIND } from "routes/route.constant";
const assetListApprovalWaiting = lazy(
  () => import("pages/PriceShared/AssetListApprovalWaiting")
);

export default {
  path: PRICE_SHARED_PENDIND,
  element: assetListApprovalWaiting,
};
