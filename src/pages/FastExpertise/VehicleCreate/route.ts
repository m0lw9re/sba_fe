import {lazy} from "react";
import {
  FAST_EXPERTISE_VEHICLE_CREATE,
  FAST_EXPERTISE_VEHICLE_EDIT,
  FAST_EXPERTISE_VEHICLE_VIEW,
} from "routes/route.constant";
const vehicleFastExpertiseCreate = lazy(
  () => import("pages/FastExpertise/VehicleCreate")
);

const vehicleFastExpertiseCreateRoute = {
  path: FAST_EXPERTISE_VEHICLE_CREATE,
  element: vehicleFastExpertiseCreate,
};
const vehicleFastExpertiseEditRoute = {
  path: FAST_EXPERTISE_VEHICLE_EDIT,
  element: vehicleFastExpertiseCreate,
};
const vehicleFastExpertiseViewRoute = {
  path: FAST_EXPERTISE_VEHICLE_VIEW,
  element: vehicleFastExpertiseCreate,
};
export {
  vehicleFastExpertiseCreateRoute,
  vehicleFastExpertiseEditRoute,
  vehicleFastExpertiseViewRoute,
};
