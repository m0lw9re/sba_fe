import { lazy } from "react";
import { PRICE_SHARED_APPROVE_APPARTMENT } from "routes/route.constant";
const priceSharedApproveApartment = lazy(
  () => import("pages/PriceShared/ApproveDenyAsset/Apartment")
);

export default {
  path: PRICE_SHARED_APPROVE_APPARTMENT,
  element: priceSharedApproveApartment,
};
