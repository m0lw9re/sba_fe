import { lazy } from "react";
import { APPRAISAL_FILES_AUTO } from "routes/route.constant";
const appraisalFilesAuto = lazy(() => import("pages/AppraisalFilesAuto"));

export default {
  path: APPRAISAL_FILES_AUTO,
  element: appraisalFilesAuto,
};
