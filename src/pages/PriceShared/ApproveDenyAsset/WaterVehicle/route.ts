import { lazy } from "react";
import { PRICE_SHARED_APPROVE_WATERVEHICLE } from "routes/route.constant";
const priceSharedApproveWaterVehicle = lazy(
  () => import("pages/PriceShared/ApproveDenyAsset/WaterVehicle")
);

export default {
  path: PRICE_SHARED_APPROVE_WATERVEHICLE,
  element: priceSharedApproveWaterVehicle,
};
