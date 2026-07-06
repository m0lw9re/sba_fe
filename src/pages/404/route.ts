import { lazy } from 'react';
import { NOT_FOUND } from 'routes/route.constant';
const notFound = lazy(() => import('pages/404'));

export default {
  path: NOT_FOUND,
  element: notFound,
};
