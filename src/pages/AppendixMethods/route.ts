import { lazy } from 'react';
import { APPENDIX_METHODS } from 'routes/route.constant';

const AppendixMethods = lazy(() => import('pages/AppendixMethods'));

const appendixMethodsRoute = {
  path: APPENDIX_METHODS,
  element: AppendixMethods,
};

export default appendixMethodsRoute;
