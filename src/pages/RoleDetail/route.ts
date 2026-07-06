import { lazy } from "react";
import { ROLE_DETAIL } from "routes/route.constant";
const roleDetail = lazy(() => import("../RoleDetail"));

export default {
  path: ROLE_DETAIL,
  element: roleDetail,
};
