import React, { useState } from "react";
import "./style.scss";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { ACCOUNTROLE } from "routes/route.constant";
import AccountRoleFilter from "./components/AccountRoleFilter/AccountRoleFilter";
import AccountRoleTable from "./components/AccountRoleTable/AccountRoleTable";
import { FilterAccountRoleType } from "constant/types";

const AccountRole = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<FilterAccountRoleType>({});
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Nhóm quyền tài khoản",
        path: ACCOUNTROLE,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [ACCOUNTROLE]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }} className="filter-category">
          <AccountRoleFilter filter={filter} setFilter={setFilter} />
        </div>
        <div className="table-category">
          <AccountRoleTable filter={filter} setFilter={setFilter} />
        </div>
      </div>
    </div>
  );
};

export default AccountRole;
