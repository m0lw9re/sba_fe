import { FilterStaffByRoleType, StaffByRoleType } from "constant/types";
import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { USER_AUTHORIZATION } from "routes/route.constant";
import UserAuthorizationFilter from "pages/AccountManagement/UserAuthorization/UserAuthorizationFilter";
import UserAuthorizationTable from "pages/AccountManagement/UserAuthorization/UserAuthorizationTable";
import { StaffApi } from "apis/staff";

const UserAuthorization = () => {
  const [filters, setFilters] = useState<FilterStaffByRoleType>({
    roleCode: 'TBP', // Default value: TBP
    companyBranchId: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [staffList, setStaffList] = useState<Array<StaffByRoleType>>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Phân quyền tài khoản",
        path: USER_AUTHORIZATION,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [USER_AUTHORIZATION]);

  const getStaffList = useCallback(async () => {
    if (filters && filters.roleCode) {
      setIsLoading(true);
      const res = await StaffApi.getStaffListByRole(filters);
      setStaffList(res.data);
    } else setStaffList([]);
    setIsLoading(false);
  }, [filters, setStaffList]);

  const handleGetStaffList = useCallback(() => {
    getStaffList();
  }, [getStaffList, isLoading]);

  useEffect(() => {
    handleGetStaffList();
  }, [filters]);

  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <UserAuthorizationFilter filters={filters} setFilter={setFilters} />
        </div>
        <UserAuthorizationTable
          isLoading={isLoading}
          staffList={staffList}
          resetStaffList={handleGetStaffList}
          role_code={filters.roleCode}
        />
      </div>
    </div>
  );
};

export default UserAuthorization;
