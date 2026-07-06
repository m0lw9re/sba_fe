import { lazy } from "react";
import { CATEGORY_ASSET_LEVEL } from "routes/route.constant";
const categoryAssetLevel = lazy(() => import("pages/CategoryManage/CategoriesAssetLevel"));

export default {
  path: CATEGORY_ASSET_LEVEL,
  element: categoryAssetLevel,
};
