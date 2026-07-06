import { lazy } from "react";
import { PRICE_SPECIFIC_PROJECT } from "routes/route.constant";
const priceSpecificProjectAsset = lazy(
  () => import("pages/PriceSpecific/PriceSpecificProjectAsset")
);

export default {
  path: PRICE_SPECIFIC_PROJECT,
  element: priceSpecificProjectAsset,
};
