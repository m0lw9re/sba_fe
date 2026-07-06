import { lazy } from "react";
import { PRICE_SHARED_WATER_VEHICLE_CREATE_ASSET } from "routes/route.constant";
const priceShareWaterVehicleAssetCreate = lazy(
  () => import("pages/PriceShared/AssetCreate/WaterWayVehicle")
);

export default {
  path: PRICE_SHARED_WATER_VEHICLE_CREATE_ASSET,
  element: priceShareWaterVehicleAssetCreate,
};
