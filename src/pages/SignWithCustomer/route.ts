import { lazy } from "react";
import { SIGN_WITH_CUSTOMER } from "routes/route.constant";
const signWithCustomer = lazy(() => import("pages/SignWithCustomer"));

export default {
  path: SIGN_WITH_CUSTOMER,
  element: signWithCustomer,
};
