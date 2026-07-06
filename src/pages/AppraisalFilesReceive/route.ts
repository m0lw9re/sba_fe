import { lazy } from "react";
import { APPRAISAL_FILES_RECEIVE } from "routes/route.constant";
const appraisalFilesReceiveUpdate = lazy(
  () => import("pages/AppraisalFilesReceive")
);

export default {
  path: APPRAISAL_FILES_RECEIVE,
  element: appraisalFilesReceiveUpdate,
};
