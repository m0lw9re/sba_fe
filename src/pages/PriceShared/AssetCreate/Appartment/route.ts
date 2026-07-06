import { lazy } from "react";
import { PRICE_SHARED_APPARTMENT_CREATE_ASSET } from "routes/route.constant";
const PriceSharedAppartmentAssetCreate = lazy(
  () => import("pages/PriceShared/AssetCreate/Appartment")
);

export default {
  path: PRICE_SHARED_APPARTMENT_CREATE_ASSET,
  element: PriceSharedAppartmentAssetCreate,
};
