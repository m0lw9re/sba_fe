import {lazy} from "react";
import {FAST_EXPERTISE_VEHICLE_DETAIL} from "routes/route.constant";
const vehicleFastExpertiseDetail = lazy(
  () => import("pages/FastExpertise/VehicleDetail")
);

export default {
  path: FAST_EXPERTISE_VEHICLE_DETAIL,
  element: vehicleFastExpertiseDetail,
};
