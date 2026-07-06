import { lazy } from "react";
import { ACCOUNTANT_DEBT_DETAIL } from "routes/route.constant";
const accountantDebtDetail = lazy(() => import("pages/AccountantDebtDetail"));

export default {
  path: ACCOUNTANT_DEBT_DETAIL,
  element: accountantDebtDetail,
};
