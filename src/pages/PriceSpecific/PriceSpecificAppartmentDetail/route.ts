import { lazy } from "react";
import { PRICE_SPECIFIC_APPARTMENT_DETAIL } from "routes/route.constant";
const priceSpecificAppartmentDetail = lazy(
  () => import("pages/PriceSpecific/PriceSpecificAppartmentDetail")
);

export default {
  path: PRICE_SPECIFIC_APPARTMENT_DETAIL,
  element: priceSpecificAppartmentDetail,
};
