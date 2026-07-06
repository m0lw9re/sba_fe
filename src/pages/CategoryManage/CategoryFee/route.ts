import { lazy } from "react";
import { CATEGORY_FEE } from "routes/route.constant";
const categoryFee = lazy(() => import("pages/CategoryManage/CategoryFee"));

export default {
  path: CATEGORY_FEE,
  element: categoryFee,
};
