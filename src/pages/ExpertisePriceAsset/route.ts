import { lazy } from "react";
import { EXPERTISE_PRICE_ASSET_INFO } from "../../routes/route.constant";
const expertisePriceAssetInfo = lazy(() => import("../ExpertisePriceAsset"));

export default {
  path: EXPERTISE_PRICE_ASSET_INFO,
  element: expertisePriceAssetInfo,
};
