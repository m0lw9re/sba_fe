import { lazy } from "react";
import { CATEGORY_STAFF_POSITION } from "routes/route.constant";
const categoryStaffPosition = lazy(
  () => import("../CategoryStaffPosition/index"),
);

export default {
  path: CATEGORY_STAFF_POSITION,
  element: categoryStaffPosition,
};
