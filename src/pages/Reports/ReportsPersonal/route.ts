import { lazy } from "react";
import { REPORT_PERSONAL } from "routes/route.constant";
const reportPersonal = lazy(() => import("pages/Reports/ReportsPersonal/index"));

export default {
  path: REPORT_PERSONAL,
  element: reportPersonal,
};
