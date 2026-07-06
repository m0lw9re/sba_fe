import { lazy } from "react";
import { ACCOUNTANT_COLLECT_SPENT } from "routes/route.constant";
const accountantCollectSpent = lazy(
  () => import("pages/AccountantCollectSpent/index")
);

export default {
  path: ACCOUNTANT_COLLECT_SPENT,
  element: accountantCollectSpent,
};
