import { lazy } from "react";
import { PRICE_SHARED_LAND_USING_CREATE_ASSET } from "routes/route.constant";
const PriceSharedLandUsingAssetCreate = lazy(() => import("pages/PriceShared/AssetCreate/LandUsing"));

export default {
  path: PRICE_SHARED_LAND_USING_CREATE_ASSET,
  element: PriceSharedLandUsingAssetCreate,
};
