import {lazy} from "react";
import {REGIONS_FUNCTION} from "routes/route.constant";
const categoryProvinceRegion = lazy(
  () => import("pages/CategoryManage/CategoryProvinceRegion")
);

export default {
  path: REGIONS_FUNCTION,
  element: categoryProvinceRegion,
};
