import { lazy } from "react";
import { REPORT_QUANTITY } from "routes/route.constant";
const reportQuantity = lazy(() => import("pages/Reports/ReportsMonthlyArising/index"));

export default {
  path: REPORT_QUANTITY,
  element: reportQuantity,
};
