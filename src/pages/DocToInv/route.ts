import { lazy } from "react";
import { DOC_TO_INVOICING } from "routes/route.constant";
const docToInvRoute = lazy(() => import("pages/DocToInv/index"));

export default {
  path: DOC_TO_INVOICING,
  element: docToInvRoute,
};
