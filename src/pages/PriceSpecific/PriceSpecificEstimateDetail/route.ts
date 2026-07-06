import { lazy } from "react";
import { PRICE_SPECIFIC_ESTIMATE_PRICE_DETAIL } from "routes/route.constant";
const priceSpecificEstimateDetail = lazy(
  () => import("pages/PriceSpecific/PriceSpecificEstimateDetail")
);

export default {
  path: PRICE_SPECIFIC_ESTIMATE_PRICE_DETAIL,
  element: priceSpecificEstimateDetail,
};
