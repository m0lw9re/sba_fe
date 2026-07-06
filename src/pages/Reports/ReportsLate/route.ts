import { lazy } from "react";
import { REPORT_LATE } from "routes/route.constant";
const reportLate = lazy(() => import("pages/Reports/ReportsLate/index"));

export default {
  path: REPORT_LATE,
  element: reportLate,
};
