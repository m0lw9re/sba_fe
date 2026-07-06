import { lazy } from "react";
import { CATEGORY_CONSTRUCTION } from "routes/route.constant";
const categoryConstruction = lazy(
  () => import("../CategoryConstruction/index")
);

export default {
  path: CATEGORY_CONSTRUCTION,
  element: categoryConstruction,
};
