import { lazy } from "react";
import { SYSTEM_LOGIN } from "routes/route.constant";
const accessHistory = lazy(() => import("pages/AccessHistory"));

export default {
  path: SYSTEM_LOGIN,
  element: accessHistory,
};
