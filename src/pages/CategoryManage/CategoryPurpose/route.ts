import { lazy } from "react";
import { CATEGORY_PURPOSE } from "routes/route.constant";
const categoryPurpose = lazy(() => import("pages/CategoryManage/CategoryPurpose"));

export default {
  path: CATEGORY_PURPOSE,
  element: categoryPurpose,
};
