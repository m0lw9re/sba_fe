import { lazy } from "react";
import { CATEGORIES_ADMINISTRATIVES } from "routes/route.constant";
const categories = lazy(() => import("pages/CategoryManage/CategoriesAdministratives"));

export default {
  path: CATEGORIES_ADMINISTRATIVES,
  element: categories,
};
