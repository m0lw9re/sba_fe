import { lazy } from "react";
import { ADVISE } from "routes/route.constant";
const advise = lazy(() => import("pages/Advise"));

export default {
  path: ADVISE,
  element: advise,
};
