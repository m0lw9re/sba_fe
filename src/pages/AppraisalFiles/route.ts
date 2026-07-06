import { lazy } from "react";
import { APPRAISAL_FILES } from "../../routes/route.constant";
const appraisalFiles = lazy(() => import("../AppraisalFiles"));

export default {
  path: APPRAISAL_FILES,
  element: appraisalFiles,
};
