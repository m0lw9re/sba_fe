import { lazy } from "react";
import { REPORT_KPI_DETAILS } from "routes/route.constant";
const reportKPIDetails = lazy(() => import("pages/Reports/ReportsKPIS/index"));

export default {
  path: REPORT_KPI_DETAILS,
  element: reportKPIDetails,
};
