import { lazy } from "react";
import { PRICE_SHARED_APPROVE_LAND_USING } from "routes/route.constant";
const priceSharedApproveLandUsing = lazy(
  () => import("pages/PriceShared/ApproveDenyAsset/LandUsing")
);

export default {
  path: PRICE_SHARED_APPROVE_LAND_USING,
  element: priceSharedApproveLandUsing,
};
