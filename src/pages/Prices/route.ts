import { lazy } from "react";
import { PRICE } from "routes/route.constant";
const price = lazy(() => import("../Prices"));

export default {
  path: PRICE,
  element: price,
};
