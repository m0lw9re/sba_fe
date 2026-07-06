import { lazy } from "react";
import { CATEGORY_COMMIT } from "routes/route.constant";
const categoryCommit = lazy(() => import("pages/CategoryManage/CategoryCommit/index"));

export default {
  path: CATEGORY_COMMIT,
  element: categoryCommit,
};
