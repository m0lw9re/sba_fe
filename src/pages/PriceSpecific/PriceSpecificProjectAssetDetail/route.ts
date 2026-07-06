import { lazy } from "react";
import { PRICE_SPECIFIC_PROJECT_DETAIL } from "routes/route.constant";
const priceSpecificProjectAssetDetail = lazy(
  () => import("pages/PriceSpecific/PriceSpecificProjectAssetDetail")
);

export default {
  path: PRICE_SPECIFIC_PROJECT_DETAIL,
  element: priceSpecificProjectAssetDetail,
};
