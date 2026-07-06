import { lazy } from "react";
import { SETTING } from "routes/route.constant";
const setting = lazy(() => import("pages/Setting"));

export default {
  path: SETTING,
  element: setting,
};
