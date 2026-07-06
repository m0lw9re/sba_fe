import { lazy } from "react";
import { REPORT_COMPLETED_FILE } from "routes/route.constant";
const reportCompletedFile = lazy(() => import("pages/Reports/ReportsCompletedFile/index"));

export default {
  path: REPORT_COMPLETED_FILE,
  element: reportCompletedFile,
};
