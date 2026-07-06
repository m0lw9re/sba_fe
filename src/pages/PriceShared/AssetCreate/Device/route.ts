import { lazy } from "react";
import { PRICE_SHARED_DEVICE_CREATE_ASSET } from "routes/route.constant";
const priceSharedDeviceAssetCreate = lazy(
  () => import("pages/PriceShared/AssetCreate/Device")
);

export default {
  path: PRICE_SHARED_DEVICE_CREATE_ASSET,
  element: priceSharedDeviceAssetCreate,
};
