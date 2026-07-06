import { lazy } from "react";
import { CATEGORY_REGIONS } from "routes/route.constant";
const categoryregions = lazy(() => import("../CategoryRegions/index"));

export default {
  path: CATEGORY_REGIONS,
  element: categoryregions,
};
