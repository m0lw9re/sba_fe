import { PermissionByRole } from "constant/types";
import {
  CommonGetAllParams,
  CommonSearchAllParams,
} from "../constants/types/common.type";
import { Permission } from "../constants/types/permission.type";
import {
  GetDetailRoleParam,
  RoleAssetType,
} from "../constants/types/role.type";
import { SBAAxiosClient } from "./base";

export const roleApi = {
  getAll: (params?: CommonGetAllParams) => {
    return SBAAxiosClient("/admin/api/v1/roles", {
      method: "GET",
      params,
    });
  },
  getOne: (params?: GetDetailRoleParam) => {
    return SBAAxiosClient("/admin/api/v1/role/" + params?.id, {
      method: "GET",
    });
  },
  search: (params?: CommonSearchAllParams) => {
    return SBAAxiosClient("/admin/api/v1/roles", {
      method: "GET",
      params,
    });
  },
  updateStatus: (id?: string, data?: Permission) => {
    return SBAAxiosClient("/admin/api/v1/role/" + id, {
      method: "PUT",
      data,
    });
  },
  updateRoleAsset: (data: RoleAssetType) => {
    return SBAAxiosClient("/assets/api/v1/assetApartment", {
      method: "PUT",
      data,
    });
  },
  delete: (id?: string) => {
    return SBAAxiosClient("/admin/api/v1/role/" + id, {
      method: "DELETE",
    });
  },
  getPermissionByRole: (roleCode: string) => {
    return SBAAxiosClient(`/admin/api/v1/role/${roleCode}`, {
      method: "GET",
    });
  },
  updatePermissionByRole: (data: Array<PermissionByRole>, roleCode: string) => {
    return SBAAxiosClient(`/admin/api/v1/role/${roleCode}`, {
      method: "PUT",
      data,
    });
  },
};
