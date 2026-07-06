import { lazy } from "react";
import { RE_PRICING } from "routes/route.constant";
const rePricing = lazy(() => import("pages/RePricing"));

export default {
  path: RE_PRICING,
  element: rePricing,
};
