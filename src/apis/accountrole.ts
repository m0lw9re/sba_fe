import { SBAAxiosClient } from "./base";
import {
  CommonGetAllParams,
  CreateAccountRoleData,
  UpdateAccountRoleData,
} from "../constants/types/common.type";
import { CommonSearchAllParams } from "../constants/types/common.type";

export const accountRoleApi = {
  getAccountRole: (params?: CommonGetAllParams) => {
    return SBAAxiosClient("/admin/api/v1/role?", {
      method: "GET",
      params,
    });
  },
  search: (params?: CommonSearchAllParams) => {
    return SBAAxiosClient("/admin/api/v1/role", {
      method: "GET",
      params,
    });
  },
  create: (data?: CreateAccountRoleData) => {
    return SBAAxiosClient("/admin/api/v1/role", {
      method: "POST",
      data,
    });
  },
  update: (data: UpdateAccountRoleData, roleCode?: string) => {
    return SBAAxiosClient(`/admin/api/v1/role/edit/${roleCode}`, {
      method: "PUT",
      data,
    });
  },
  delete: (roleCode: string) => {
    return SBAAxiosClient("/admin/api/v1/role/" + roleCode, {
      method: "DELETE",
    });
  },
};
