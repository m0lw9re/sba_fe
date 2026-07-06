import { lazy } from "react";
import { LISTFUNCTION } from "routes/route.constant";
const listfunction = lazy(() => import("../ListFunction/index"));

export default {
  path: LISTFUNCTION,
  element: listfunction,
};
