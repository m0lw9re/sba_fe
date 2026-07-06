import { lazy } from "react";
import { PRICE_SHARED_PROJECT_CREATE_ASSET } from "routes/route.constant";
const priceSharedProjectAssetCreate = lazy(
  () => import("pages/PriceShared/AssetCreate/ProjectAsset")
);

export default {
  path: PRICE_SHARED_PROJECT_CREATE_ASSET,
  element: priceSharedProjectAssetCreate,
};
