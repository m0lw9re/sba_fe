import { lazy } from "react";
import { ACCOUNTANT_FEE_NOTIFICATIONS_LIST } from "routes/route.constant";
const AccountantFeeNotificationsUpdate = lazy(
  () => import("pages/AccountantFeeNotificationsList/index")
);

export default {
  path: ACCOUNTANT_FEE_NOTIFICATIONS_LIST,
  element: AccountantFeeNotificationsUpdate,
};
