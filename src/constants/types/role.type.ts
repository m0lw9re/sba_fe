import { PermissionGroup } from "./permission.type";

export type Role = {
  roleId: string;
  roleName: string;
  departmentId: string;
  departmentName: string;
  description: string;
  dateCreate: string;
  dateModify: string;
  status: number;
  permissionGroupDtos: Array<PermissionGroup>;
};

export type RoleAssetType = {
  roleId: string | null;
  roleName: string | null;
  whoCreate: string | null;
  dateCreate: string | null;
  dateModify: string | null;
  status: number | null;
  note: string | null;
};

export type RoleAssetBasicType = {
  roleId?: string | null;
  roleName?: string | null;
  whoCreate?: string | null;
  dateCreate?: string | null;
  dateModify?: string | null;
  status?: number | null;
  note?: string | null;
};

export type GetDetailRoleParam = {
  id?: string;
};

export type GetStaffListByRoleId = {
  id?: string;
  page?: number;
  limit?: number;
};

export type FilterRoleType = {
  keyword?: string;
  status?: number;
  start?: number;
  end?: number;
};
