import { lazy } from "react";
import { REPORT_ALL } from "routes/route.constant";
const reportAll = lazy(() => import("pages/Reports/ReportsAll/index"));

export default {
  path: REPORT_ALL,
  element: reportAll,
};