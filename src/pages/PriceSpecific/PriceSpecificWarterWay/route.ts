import { lazy } from "react";
import { PRICE_SPECIFIC_WATER_WAY } from "routes/route.constant";
const priceSpecificWaterWay = lazy(() => import("pages/PriceSpecific/PriceSpecificWarterWay"));

export default {
  path: PRICE_SPECIFIC_WATER_WAY,
  element: priceSpecificWaterWay,
};
