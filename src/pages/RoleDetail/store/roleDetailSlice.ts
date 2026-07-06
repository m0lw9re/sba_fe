import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetDetailRoleSuccessPayload, GetStaffListSuccess } from "./store.type";
import {
  GetDetailRoleParam,
  GetStaffListByRoleId,
} from "../../../constants/types/role.type";
import { PermissionGroup } from "../../../constants/types/permission.type";
import { Staff } from "../../../constants/types/common.type";

type RoleDetailState = {
  roleId: string;
  roleName: string;
  departmentId: string;
  departmentName: string;
  description: string;
  dateCreate: string;
  dateModify: string;
  whoCreate: string;
  status: number;
  permissionGroupDtos: Array<PermissionGroup>;
  registedAccount: Array<Staff>;
  isLoadingGetDetail: boolean;
  isLoadingGetStaffList: boolean;
  totalStaff: number;
  limitPageStaff: number;
  pageStaff: number;
  note: string;
};

const initialState: RoleDetailState = {
  totalStaff: 0,
  limitPageStaff: 10,
  pageStaff: 1,
  roleId: "",
  roleName: "",
  departmentId: "",
  departmentName: "",
  description: "",
  dateCreate: "",
  dateModify: "",
  whoCreate: "",
  status: 0,
  registedAccount: [],
  permissionGroupDtos: [],
  isLoadingGetDetail: false,
  isLoadingGetStaffList: false,
  note: "",
};

export const roleDetailSlice = createSlice({
  name: "roleDetail",
  initialState,
  reducers: {
    getDetailRole: (state, action: PayloadAction<GetDetailRoleParam>) => {
      state.isLoadingGetDetail = true;
    },
    getDetailRoleSuccess: (
      state,
      action: PayloadAction<GetDetailRoleSuccessPayload>
    ) => {
      state.roleId = action.payload.roleId;
      state.roleName = action.payload.roleName;
      state.departmentId = action.payload.departmentId;
      state.departmentName = action.payload.departmentName;
      state.description = action.payload.description;
      state.dateCreate = action.payload.dateCreate;
      state.dateModify = action.payload.dateModify;
      state.status = action.payload.status;
      state.permissionGroupDtos = action.payload.permissionGroupDtos;
      state.isLoadingGetDetail = false;
    },
    getDetailRoleFailed: (state) => {
      state.isLoadingGetDetail = false;
    },
    getListStaff: (state, action: PayloadAction<GetStaffListByRoleId>) => {
      state.isLoadingGetStaffList = false;
    },
    getListStaffSuccess: (
      state,
      action: PayloadAction<GetStaffListSuccess>
    ) => {
      state.limitPageStaff = action.payload.limit;
      state.isLoadingGetStaffList = false;
      state.pageStaff = action.payload.page;
      state.totalStaff = action.payload.total;
      state.registedAccount = action.payload.data;
    },
    getListStaffFailed: (state) => {
      state.isLoadingGetStaffList = false;
    },
  },
});

export const {
  getDetailRole,
  getDetailRoleSuccess,
  getDetailRoleFailed,
  getListStaff,
  getListStaffFailed,
  getListStaffSuccess,
} = roleDetailSlice.actions;

export default roleDetailSlice.reducer;
