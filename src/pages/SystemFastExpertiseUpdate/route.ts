import { lazy } from "react";
import { SYSTEM_FAST_EXPERTISE } from "routes/route.constant";
const systemFastExpertiseUpdate = lazy(() => import("pages/SystemFastExpertiseUpdate"));

export default {
  path: SYSTEM_FAST_EXPERTISE,
  element: systemFastExpertiseUpdate,
};
