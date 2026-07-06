import { lazy } from "react";
import { ACCOUNTANT_CREATE_CO_SP } from "../../routes/route.constant";
const accountantCreateCoSp = lazy(
  () => import("../AccountantCreateCoSp/index")
);

export default {
  path: ACCOUNTANT_CREATE_CO_SP,
  element: accountantCreateCoSp,
};
