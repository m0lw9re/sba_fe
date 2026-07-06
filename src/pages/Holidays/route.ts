import { lazy } from "react";
import { HOLIDAYS } from "routes/route.constant";
const holidays = lazy(() => import("pages/Holidays"));

export default {
  path: HOLIDAYS,
  element: holidays,
};
