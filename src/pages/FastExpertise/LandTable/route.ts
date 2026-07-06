import {lazy} from "react";
import {FAST_EXPERTISE_LAND_TOWNHOUSE} from "routes/route.constant";
const landFastExpert = lazy(() => import("pages/FastExpertise/LandTable"));

export default {
  path: FAST_EXPERTISE_LAND_TOWNHOUSE,
  element: landFastExpert,
};
