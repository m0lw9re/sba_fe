import { SBAAxiosClient, request } from "./base";
import {
  CommonGetAllParams,
  GetAccountDetailParams,
  CreateAccountData,
  ChangePassworData,
  ChangeStatusParams,
  UpdateAccountData,
  Staff
} from "../constants/types/common.type";
import { GetStaffListByRoleId } from "../constants/types/role.type";
import { GetAllCommonType, StaffEditType, staffCreateType } from "constant/types";

export const accountApi = {
  getAccounts: (params?: CommonGetAllParams) => {
    return SBAAxiosClient("/admin/api/v1/staffs/search", {
      method: "GET",
      params,
    });
  },
  search: (params?: GetAllCommonType, data?: Staff) => {
    return SBAAxiosClient(`/admin/api/v1/staffs/search?`, {
      method: "GET",
      params,
      data
    });
  },
  getDetail: (params?: GetAccountDetailParams) => {
    return SBAAxiosClient("/admin/api/v1/staff", {
      method: "GET",
      params,
    });
  },
  create: (data?: CreateAccountData) => {
    return SBAAxiosClient("/admin/api/v1/staff/create_account", {
      method: "POST",
      data,
    });
  },
  update: (data?: UpdateAccountData) => {
    return request("/user", {
      method: "PUT",
      data,
    });
  },
  getByRoleId: (params?: GetStaffListByRoleId) => {
    return request("/api/v1/staffs/role", {
      method: "GET",
      params,
    });
  },
  changePassword: (data?: ChangePassworData) => {
    return SBAAxiosClient("/admin/api/v1/staff/change_password", {
      method: "PUT",
      data,
    });
  },
  updateStatus: (params?: ChangeStatusParams) => {
    return SBAAxiosClient("/admin/api/v1/staff/update_status", {
      method: "PUT",
      params,
    });
  },
  createNew: (data: staffCreateType) => {
    return SBAAxiosClient("/admin/api/v1/staff", {
      method: "POST",
      data,
    });
  },
  updateStaff: (data: StaffEditType) => {
    return SBAAxiosClient("admin/api/v1/staff", {
      method: "PUT",
      data,
    });
  },
};
