import { lazy } from "react";
import { PRICE_SPECIFIC_ROAD_VEHICLE } from "routes/route.constant";
const priceSpecificRoadVehicle = lazy(
  () => import("pages/PriceSpecific/PriceSpecificRoadVehicle")
);

export default {
  path: PRICE_SPECIFIC_ROAD_VEHICLE,
  element: priceSpecificRoadVehicle,
};
