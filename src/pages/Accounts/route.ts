import { lazy } from "react";
import { ACCOUNT } from "../../routes/route.constant";
const accounts = lazy(() => import("../Accounts/index"));

export default {
  path: ACCOUNT,
  element: accounts,
};
