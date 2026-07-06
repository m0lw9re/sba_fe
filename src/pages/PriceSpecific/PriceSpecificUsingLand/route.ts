import { lazy } from "react";
import { PRICE_SPECIFIC_USING_LAND } from "routes/route.constant";
const priceSpecificUsingLand = lazy(() => import("pages/PriceSpecific/PriceSpecificUsingLand"));

export default {
  path: PRICE_SPECIFIC_USING_LAND,
  element: priceSpecificUsingLand,
};
