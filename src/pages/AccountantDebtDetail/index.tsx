import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  ACCOUNTANT_DEBT_DETAIL,
  ACCOUNTANT_DEBT_FOLLOW,
} from "routes/route.constant";
import FeeNotifiDetail from "./components/FeeNotifiDetail";
import { useParams } from "react-router-dom";

const AccountantDebtDetail = () => {
  let { id }: { id?: string } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách theo dõi doanh thu, công nợ",
        path: ACCOUNTANT_DEBT_FOLLOW,
      },
      {
        label: "Chi tiết doanh thu, công nợ",
        path: ACCOUNTANT_DEBT_DETAIL.replace(":id", id || ""),
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [id]);

  return (
    <div className="page-container">
      <FeeNotifiDetail />
    </div>
  );
};

export default AccountantDebtDetail;
