import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  ACCOUNTANT_FEE_NOTIFICATIONS,
  ACCOUNTANT_DEBT_FOLLOW,
} from "routes/route.constant";
import FeeNotifiDetail from "./components/FeeNotifiDetail";

const AccountantFeeNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Lập thông báo phí",
        path: ACCOUNTANT_DEBT_FOLLOW,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [ACCOUNTANT_FEE_NOTIFICATIONS]);

  return (
    <div className="page-container">
      <FeeNotifiDetail />
    </div>
  );
};

export default AccountantFeeNotifications;
