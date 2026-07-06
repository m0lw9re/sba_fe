import { lazy } from "react";
import { PRICE_SPECIFIC_USING_LAND_DETAIL } from "routes/route.constant";
const priceSpecificUsingLandDetail = lazy(
  () => import("pages/PriceSpecific/PriceSpecificUsingLandDetail")
);

export default {
  path: PRICE_SPECIFIC_USING_LAND_DETAIL,
  element: priceSpecificUsingLandDetail,
};
