import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  ACCOUNTANT_MANUAL_EDIT_DETAIL
} from "routes/route.constant";
import FeeNotifiDetail from "./components/FeeNotifiDetail";

const AccountantManualEditDetail = () => {
  let { id }: { id?: string } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let breadCrumb = [
      {
        label: "Sửa Phí Thủ công",
        path: ACCOUNTANT_MANUAL_EDIT_DETAIL.replace(":id", id || ""),
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

export default AccountantManualEditDetail;
