/* eslint-disable import/no-anonymous-default-export */
import { lazy } from "react";
import { UNIDENTIFIED_PROFILE } from "routes/route.constant";
const UnidentifiedProfile = lazy(
  () => import("pages/UnidentifiedProfile/index")
);

export default {
  path: UNIDENTIFIED_PROFILE,
  element: UnidentifiedProfile,
};
