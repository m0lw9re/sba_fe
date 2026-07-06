import { lazy } from "react";
import { PRICE_SHARED_APPROVE_ROADVEHICLE } from "routes/route.constant";
const priceSharedApproveRoadVehicle = lazy(
  () => import("pages/PriceShared/ApproveDenyAsset/RoadVehicle")
);

export default {
  path: PRICE_SHARED_APPROVE_ROADVEHICLE,
  element: priceSharedApproveRoadVehicle,
};
