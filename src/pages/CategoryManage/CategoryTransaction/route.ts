import { lazy } from "react";
import { CATEGORY_TRANSACTION } from "routes/route.constant";
const categorytransaction = lazy(() => import("../CategoryTransaction/index"));

export default {
  path: CATEGORY_TRANSACTION,
  element: categorytransaction,
};
