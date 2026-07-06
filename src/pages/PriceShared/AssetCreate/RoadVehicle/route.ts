import { lazy } from "react";
import { PRICE_SHARED_ROAD_VEHICLE_CREATE_ASSET } from "routes/route.constant";
const priceSharedRoadVehicleAssetCreate = lazy(
  () => import("pages/PriceShared/AssetCreate/RoadVehicle")
);

export default {
  path: PRICE_SHARED_ROAD_VEHICLE_CREATE_ASSET,
  element: priceSharedRoadVehicleAssetCreate,
};
