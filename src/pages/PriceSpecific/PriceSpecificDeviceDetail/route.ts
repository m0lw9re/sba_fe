import { lazy } from "react";
import { PRICE_SPECIFIC_DEVICE_DETAIL } from "routes/route.constant";
const priceSpecificDeviceDetail = lazy(
  () => import("pages/PriceSpecific/PriceSpecificDeviceDetail")
);

export default {
  path: PRICE_SPECIFIC_DEVICE_DETAIL,
  element: priceSpecificDeviceDetail,
};
