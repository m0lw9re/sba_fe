import { lazy } from 'react';
import { APPRAISAL_RESULTS } from 'routes/route.constant';

const AppraisalResults = lazy(() => import('pages/AppraisalResults'));

const appraisalResultsRoute = {
  path: APPRAISAL_RESULTS,
  element: AppraisalResults,
};

export default appraisalResultsRoute;
