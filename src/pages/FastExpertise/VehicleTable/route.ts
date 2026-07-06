import {lazy} from "react";
import {FAST_EXPERTISE_VEHICLE} from "routes/route.constant";
const vehicleFastExpert = lazy(
  () => import("pages/FastExpertise/VehicleTable")
);

export default {
  path: FAST_EXPERTISE_VEHICLE,
  element: vehicleFastExpert,
};
