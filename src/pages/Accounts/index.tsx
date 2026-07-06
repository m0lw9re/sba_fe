import { AccountTable } from "pages/Accounts/subcomponents/AccountTable/AccountTable";
import { ACCOUNT } from "routes/route.constant";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";

const AccountList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh mục người dùng",
        path: ACCOUNT,
      },
    ]
    dispatch(setSelectedBeadCrumb(breadCrumb))
  }, [ACCOUNT])

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <AccountTable />
      </div>
    </div>
  );
};

export default AccountList;
