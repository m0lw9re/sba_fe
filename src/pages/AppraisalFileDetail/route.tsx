import { lazy } from "react";
import { APPRAISAL_FILE_DETAIL } from "routes/route.constant";
const appraisalFileDetail = lazy(() => import("pages/AppraisalFileDetail"));

export default {
  path: APPRAISAL_FILE_DETAIL,
  element: appraisalFileDetail,
};
