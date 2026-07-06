import { lazy } from "react";
import { FAST_APPRAISAL_FILES } from "routes/route.constant";
const fastAppraisalFiles = lazy(() => import("pages/FastAppraisalFiles"));

export default {
  path: FAST_APPRAISAL_FILES,
  element: fastAppraisalFiles,
};
