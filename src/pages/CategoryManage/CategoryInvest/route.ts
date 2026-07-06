import {lazy} from "react";
import {CATEGORY_INVEST} from "routes/route.constant";
const categoryInvest = lazy(
  () => import("pages/CategoryManage/CategoryInvest")
);

export default {
  path: CATEGORY_INVEST,
  element: categoryInvest,
};
