import { lazy } from "react";
import { DEBT_COLLECTION } from "routes/route.constant";
const DebtCollection = lazy(
  () => import("pages/DebtCollection/index")
);

export default {
  path: DEBT_COLLECTION,
  element: DebtCollection,
};
