import { lazy } from "react";
import { PRICE_SHARED_DENY } from "routes/route.constant";
const assetListApprovalDeny = lazy(
  () => import("pages/PriceShared/AssetListAppovalDeny")
);

export default {
  path: PRICE_SHARED_DENY,
  element: assetListApprovalDeny,
};
