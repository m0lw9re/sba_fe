import { lazy } from "react";
import { PRICE_SHARED_APPROVE_PROJECT } from "routes/route.constant";
const priceSharedApproveProject = lazy(
  () => import("pages/PriceShared/ApproveDenyAsset/LandUsing")
);

export default {
  path: PRICE_SHARED_APPROVE_PROJECT,
  element: priceSharedApproveProject,
};
