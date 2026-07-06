import { lazy } from "react";
import { APPROVE_PRICE_SHARED } from "routes/route.constant";
const approvePriceShared = lazy(() => import("pages/PriceShared/ApprovePriceShared"));

export default {
  path: APPROVE_PRICE_SHARED,
  element: approvePriceShared,
};
