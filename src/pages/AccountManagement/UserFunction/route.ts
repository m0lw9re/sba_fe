import { lazy } from "react";
import { USER_FUNCTION } from "routes/route.constant";
const userFunction = lazy(() => import("pages/AccountManagement/UserFunction"));
const userFunctionV2 = lazy(() => import("pages/AccountManagement/UserFunctionV2"));

export default {
  path: USER_FUNCTION,
  element: userFunctionV2,
};
