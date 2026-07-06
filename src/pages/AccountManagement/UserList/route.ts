import { lazy } from "react";
import { USER_LIST } from "routes/route.constant";
const userList = lazy(() => import("pages/AccountManagement/UserList"));

export default {
  path: USER_LIST,
  element: userList,
};
