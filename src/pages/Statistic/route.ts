import { lazy } from "react";
import { STATISTIC } from "routes/route.constant";
const statistic = lazy(() => import("pages/Statistic"));

export default {
  path: STATISTIC,
  element: statistic,
};
