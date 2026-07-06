import { lazy } from "react";
import { PRICE_SPECIFIC_WATER_WAY_DETAIL } from "routes/route.constant";
const priceSpecificWaterVehicleDetail = lazy(
  () => import("pages/PriceSpecific/PriceSpecificWaterVehicleDetail")
);

export default {
  path: PRICE_SPECIFIC_WATER_WAY_DETAIL,
  element: priceSpecificWaterVehicleDetail,
};
