import { lazy } from "react";
import { ACCOUNTANT_DEBT_FOLLOW } from "routes/route.constant";
const AccountantDebtFollow = lazy(
  () => import("pages/AccountantDebtFollow/index")
);

export default {
  path: ACCOUNTANT_DEBT_FOLLOW,
  element: AccountantDebtFollow,
};
