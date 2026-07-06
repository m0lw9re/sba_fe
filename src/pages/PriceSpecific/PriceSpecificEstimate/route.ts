import { lazy } from "react";
import { PRICE_SPECIFIC_ESTIMATE_PRICE } from "routes/route.constant";
const priceSpecificEstimateAsset = lazy(
  () => import("pages/PriceSpecific/PriceSpecificEstimate")
);

export default {
  path: PRICE_SPECIFIC_ESTIMATE_PRICE,
  element: priceSpecificEstimateAsset,
};
