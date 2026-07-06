import { lazy } from "react";
import { REPORT_DEBT } from "routes/route.constant";
const reportDebt = lazy(() => import("pages/Reports/ReportsDebt/index"));

export default {
  path: REPORT_DEBT,
  element: reportDebt,
};
