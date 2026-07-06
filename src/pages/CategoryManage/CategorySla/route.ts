import { lazy } from "react";
import { CATEGORY_SLA } from "routes/route.constant";
const categorySla = lazy(() => import("../CategorySla"));

export default {
  path: CATEGORY_SLA,
  element: categorySla,
};
