import { lazy } from 'react';
import { ACCOUNTANT_FEE_NOTIFICATIONS } from 'routes/route.constant';
const accountantFeeNotifications = lazy(
  () => import('pages/AccountantFeeNotifications'),
);

export default {
  path: ACCOUNTANT_FEE_NOTIFICATIONS,
  element: accountantFeeNotifications,
};
