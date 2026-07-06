import { lazy } from "react";
import { ACCOUNT_DETAIL } from "../../routes/route.constant";
const accountDetail = lazy(() => import("pages/AccountDetailUpdate"));

export default {
  path: ACCOUNT_DETAIL,
  element: accountDetail,
};