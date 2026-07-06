import { lazy } from "react";
import { CATEGORY_BUSSINESS_FEE } from "routes/route.constant";
const categoriesBussinessFee = lazy(() => import("pages/BussinessFee"));

export default {
  path: CATEGORY_BUSSINESS_FEE,
  element: categoriesBussinessFee,
};
