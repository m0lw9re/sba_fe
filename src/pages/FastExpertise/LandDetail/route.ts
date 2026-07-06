import {lazy} from "react";
import {FAST_EXPERTISE_LAND_TOWNHOUSE_DETAIL} from "routes/route.constant";
const landFastExpertiseDetail = lazy(
  () => import("pages/FastExpertise/LandDetail")
);

export default {
  path: FAST_EXPERTISE_LAND_TOWNHOUSE_DETAIL,
  element: landFastExpertiseDetail,
};
