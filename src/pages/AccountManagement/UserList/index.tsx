import { FilterStaffType } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { USER_LIST } from "routes/route.constant";
import UserListFilter from "pages/AccountManagement/UserList/UserListFilter";
import UserListTable from "pages/AccountManagement/UserList/UserListTable";

const UserList = () => {
  const [filters, setFilters] = useState<FilterStaffType>({});
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Danh sách tài khoản",
        path: USER_LIST,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [USER_LIST]);
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <UserListFilter filters={filters} setFilter={setFilters} />
        </div>
        <UserListTable filters={filters} setFilter={setFilters} />
      </div>
    </div>
  );
};

export default UserList;
