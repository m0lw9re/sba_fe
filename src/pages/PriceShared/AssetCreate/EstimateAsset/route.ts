import { lazy } from "react";
import { PRICE_SHARED_ESTIMATE_CREATE_ASSET } from "routes/route.constant";
const priceSharedEstimateAssetCreate = lazy(
  () => import("pages/PriceShared/AssetCreate/EstimateAsset")
);

export default {
  path: PRICE_SHARED_ESTIMATE_CREATE_ASSET,
  element: priceSharedEstimateAssetCreate,
};
