import { lazy } from "react";
import { APPRAISAL_FILES_HANDMADE } from "routes/route.constant";
const apprailsalFilesHandMade = lazy(() => import("pages/AppraisalFilesHandMade"));

export default {
  path: APPRAISAL_FILES_HANDMADE,
  element: apprailsalFilesHandMade,
};
