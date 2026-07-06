import { lazy } from "react";
import { ACCOUNTANT_APPROVED } from "../../routes/route.constant";
const accountantApprpoved = lazy(() => import("../AccountantApproved/index"));

export default {
  path: ACCOUNTANT_APPROVED,
  element: accountantApprpoved,
};
