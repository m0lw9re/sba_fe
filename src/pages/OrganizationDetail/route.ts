import { lazy } from "react";
import { ORGANIZATION_DETAIL } from "../../routes/route.constant";
const organizationDetail = lazy(() => import("../OrganizationDetail"));

export default {
  path: ORGANIZATION_DETAIL,
  element: organizationDetail,
};