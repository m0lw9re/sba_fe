import { lazy } from "react";
import { PRICE_SPECIFIC_APPARTMENT } from "routes/route.constant";
const priceSpecificAppartment = lazy(
  () => import("pages/PriceSpecific/PriceSpecificAppartment")
);

export default {
  path: PRICE_SPECIFIC_APPARTMENT,
  element: priceSpecificAppartment,
};
