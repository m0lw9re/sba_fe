import { lazy } from "react";
import { ACCOUNTROLE } from "routes/route.constant";
const accountrole = lazy(() => import("../AccountRole/index"));

export default {
  path: ACCOUNTROLE,
  element: accountrole,
};
