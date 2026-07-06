import { lazy } from "react";
import { CATEGORY_DEPARTMENT } from "routes/route.constant";
const categoryDepartment = lazy(() => import("../CategoryDepartment/index"));

export default {
  path: CATEGORY_DEPARTMENT,
  element: categoryDepartment,
};
