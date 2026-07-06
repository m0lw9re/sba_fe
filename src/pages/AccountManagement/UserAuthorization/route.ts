import { lazy } from "react";
import { USER_AUTHORIZATION } from "routes/route.constant";
const userAuthorization = lazy(() => import("pages/AccountManagement/UserAuthorization"));

export default {
  path: USER_AUTHORIZATION,
  element: userAuthorization,
};
