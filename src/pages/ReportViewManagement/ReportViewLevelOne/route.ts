import { lazy } from "react";
import { REPORT_VIEW_LEVEL_ONE } from "routes/route.constant";
const reportViewLevelOne = lazy(
  () => import("pages/ReportViewManagement/ReportViewLevelOne")
);

export default {
  path: REPORT_VIEW_LEVEL_ONE,
  element: reportViewLevelOne,
};
