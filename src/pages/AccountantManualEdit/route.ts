import { lazy } from "react";
import { ACCOUNTANT_MANUAL_EDIT } from "routes/route.constant";
const AccountantManualEdit = lazy(
  () => import("pages/AccountantManualEdit/index")
);

export default {
  path: ACCOUNTANT_MANUAL_EDIT,
  element: AccountantManualEdit,
};
