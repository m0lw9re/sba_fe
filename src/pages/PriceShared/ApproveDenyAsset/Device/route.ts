import { lazy } from "react";
import { PRICE_SHARED_APPROVE_DEVICE } from "routes/route.constant";
const priceSharedApproveDevice = lazy(
  () => import("pages/PriceShared/ApproveDenyAsset/Device")
);

export default {
  path: PRICE_SHARED_APPROVE_DEVICE,
  element: priceSharedApproveDevice,
};
