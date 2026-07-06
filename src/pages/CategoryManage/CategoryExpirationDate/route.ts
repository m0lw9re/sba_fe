import { lazy } from "react";
import { CATEGORY_EXPIRATION_DATE } from "routes/route.constant";
const CategoryExpirationDate = lazy(
  () => import("pages/CategoryManage/CategoryExpirationDate")
);

export default {
  path: CATEGORY_EXPIRATION_DATE,
  element: CategoryExpirationDate,
};
