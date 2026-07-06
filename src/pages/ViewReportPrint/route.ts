/* eslint-disable import/no-anonymous-default-export */
import { lazy } from "react";
import { VIEW_REPORT_PRINT_PAGE } from "routes/route.constant";
const viewReportPrint = lazy(() => import("pages/ViewReportPrint"));

export default {
  path: VIEW_REPORT_PRINT_PAGE,
  element: viewReportPrint,
};
