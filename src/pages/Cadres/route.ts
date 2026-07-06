import { lazy } from "react";
import { CADRES } from "routes/route.constant";
const cadres = lazy(() => import("pages/Cadres"));

export default {
  path: CADRES,
  element: cadres,
};
