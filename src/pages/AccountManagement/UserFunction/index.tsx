import { setSelectedBeadCrumb } from "pages/App/store/appSlice";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { USER_FUNCTION } from "routes/route.constant";
import UserFunctionFilter from "pages/AccountManagement/UserFunction/UserFunctionFilter";
import UserFunctionTable from "pages/AccountManagement/UserFunction/UserFunctionTable";
import { PermissionByRole } from "constant/types";
import { roleApi } from "apis/role";
import { message } from "antd";

const UserFunction = () => {
  const [filters, setFilters] = useState<{ roleCode?: string }>({});
  const [permissionByRole, setPermissionByRole] = useState<PermissionByRole[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getPermission = useCallback(async () => {
    if (filters?.roleCode) {
      setIsLoading(true);
      const res = await roleApi.getPermissionByRole(filters.roleCode);
      if (res.data.statusCodeValue === 200) {
        setPermissionByRole(res.data.body);
      } else message.error("Lỗi khi lấy dữ liệu");
    }
    setIsLoading(false);
  }, [filters]);

  const handleGetPermission = useCallback(() => {
    getPermission();
  }, [getPermission, isLoading]);

  useEffect(() => {
    handleGetPermission();
  }, [filters.roleCode]);

  const dispatch = useDispatch();
  useEffect(() => {
    let breadCrumb = [
      {
        label: "Phân quyền chức năng",
        path: USER_FUNCTION,
      },
    ];
    dispatch(setSelectedBeadCrumb(breadCrumb));
  }, [USER_FUNCTION]);
  return (
    <div style={{ width: "100%" }}>
      <div className="page-container">
        <div style={{ marginBottom: "8px" }}>
          <UserFunctionFilter filters={filters} setFilter={setFilters} />
        </div>
        <div style={{ marginBottom: "8px" }}>
          <UserFunctionTable
            resetPermissionByRole={handleGetPermission}
            filters={filters}
            isLoading={isLoading}
            permissionByRole={permissionByRole}
          />
        </div>
      </div>
    </div>
  );
};

export default UserFunction;
