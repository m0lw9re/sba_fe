import { lazy } from "react";
import { CATEGORY_RISK } from "routes/route.constant";
const categoryrisk = lazy(() => import("../CategoryRisk/index"));

export default {
  path: CATEGORY_RISK,
  element: categoryrisk,
};
