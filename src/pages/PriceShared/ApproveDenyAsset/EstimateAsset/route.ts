import { lazy } from "react";
import { PRICE_SHARED_APPROVE_ESTIMATE } from "routes/route.constant";
const priceSharedApproveEstimate = lazy(
  () => import("pages/PriceShared/ApproveDenyAsset/EstimateAsset")
);

export default {
  path: PRICE_SHARED_APPROVE_ESTIMATE,
  element: priceSharedApproveEstimate,
};
