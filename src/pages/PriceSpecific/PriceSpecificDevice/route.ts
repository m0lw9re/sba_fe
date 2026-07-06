import { lazy } from "react";
import { PRICE_SPECIFIC_DEVICE } from "routes/route.constant";
const priceSpecificDevice = lazy(() => import("pages/PriceSpecific/PriceSpecificDevice"));

export default {
  path: PRICE_SPECIFIC_DEVICE,
  element: priceSpecificDevice,
};
