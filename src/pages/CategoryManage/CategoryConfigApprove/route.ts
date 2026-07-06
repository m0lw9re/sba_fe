import { lazy } from 'react';
import { CATEGORY_CONFIG_APPROVE } from 'routes/route.constant';
const categoryConfigApprove = lazy(() => import('pages/CategoryManage/CategoryConfigApprove'));

export default {
  path: CATEGORY_CONFIG_APPROVE,
  element: categoryConfigApprove,
};
