import { lazy } from "react";
import { CATEGORY_LEGAL } from "routes/route.constant";
const categoryLegal = lazy(() => import("pages/CategoryManage/CategoryLegal"));

export default {
  path: CATEGORY_LEGAL,
  element: categoryLegal,
};
