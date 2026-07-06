import { lazy } from "react";
import { PRICE_SPECIFIC_ROAD_VEHICLE_DETAIL } from "routes/route.constant";
const priceSpecificRoadVehicleDetail = lazy(
  () => import("pages/PriceSpecific/PriceSpecificRoadVehicleDetail")
);

export default {
  path: PRICE_SPECIFIC_ROAD_VEHICLE_DETAIL,
  element: priceSpecificRoadVehicleDetail,
};
