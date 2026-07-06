import { lazy } from "react";
import { VEHICLE_BRAND } from "routes/route.constant";
const vehicleBrand = lazy(() => import("pages/VehicleBrand"));

export default {
  path: VEHICLE_BRAND,
  element: vehicleBrand,
};
