import { lazy } from "react";
import { ACCOUNTANT_MANUAL_EDIT_DETAIL } from "routes/route.constant";
const AccountantManualEditDetail = lazy(() => import("pages/AccountantManualEditDetail"));

export default {
  path: ACCOUNTANT_MANUAL_EDIT_DETAIL,
  element: AccountantManualEditDetail,
};
