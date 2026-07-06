import { lazy } from "react";
import { APPRAISAL_FILES_GIVE } from "routes/route.constant";
const appraisalFilesGiveUpdate = lazy(() => import("pages/AppraisalFilesGive"));

export default {
  path: APPRAISAL_FILES_GIVE,
  element: appraisalFilesGiveUpdate,
};
