import { lazy } from "react";
import { SYSTEM_PARAMETERS } from "routes/route.constant";
const systemParams = lazy(() => import("pages/SystemParams"));

export default {
  path: SYSTEM_PARAMETERS,
  element: systemParams,
};
