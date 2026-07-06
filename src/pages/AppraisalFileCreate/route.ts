import { lazy } from "react";
import { APPRAISAL_FILES_CREATE } from "routes/route.constant";
const apprailsalFilesCreateNew = lazy(
  () => import("pages/AppraisalFileCreate")
);

export default {
  path: APPRAISAL_FILES_CREATE,
  element: apprailsalFilesCreateNew,
};
