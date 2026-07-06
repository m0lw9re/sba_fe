import {lazy} from "react";
import {
  FAST_EXPERTISE_LAND_TOWNHOUSE_CREATE,
  FAST_EXPERTISE_LAND_TOWNHOUSE_EDIT,
  FAST_EXPERTISE_LAND_TOWNHOUSE_VIEW,
} from "routes/route.constant";
const landFastExpertiseCreate = lazy(
  () => import("pages/FastExpertise/LandCreate")
);

const landFastExpertiseCreateRoute = {
  path: FAST_EXPERTISE_LAND_TOWNHOUSE_CREATE,
  element: landFastExpertiseCreate,
};
const landFastExpertiseEditRoute = {
  path: FAST_EXPERTISE_LAND_TOWNHOUSE_EDIT,
  element: landFastExpertiseCreate,
};
const landFastExpertiseViewRoute = {
  path: FAST_EXPERTISE_LAND_TOWNHOUSE_VIEW,
  element: landFastExpertiseCreate,
};
export {
  landFastExpertiseCreateRoute,
  landFastExpertiseEditRoute,
  landFastExpertiseViewRoute,
};
