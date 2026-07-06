import { lazy } from "react";
import { PRICE_FRAME } from "routes/route.constant";
const priceFrame = lazy(() => import("pages/PriceFrame"));

export default {
  path: PRICE_FRAME,
  element: priceFrame,
};
