import { lazy } from "react";
import { CATEGORY_KPI } from "routes/route.constant";
const categoryKpi = lazy(() => import("../CategoryKpi/index"));

export default {
  path: CATEGORY_KPI,
  element: categoryKpi,
};
