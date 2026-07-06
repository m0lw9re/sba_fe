import { lazy } from "react";
import { CONFIGCATEGORIES } from "routes/route.constant";
const categories = lazy(() => import("pages/ConfigCategories"));

export default {
  path: CONFIGCATEGORIES,
  element: categories,
};
