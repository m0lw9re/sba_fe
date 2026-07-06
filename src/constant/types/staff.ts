type StaffType = {
  key?: string;
  staffId: string;
  username: string | null;
  staffName: string | null;
  phone: string | null;
  gender: null | number;
  genderText: string | null;
  dateOfBirth: string | null;
  daysOff: string | null;
  assets: null | string;
  provinces: null | string;
  companyBranchId: number | null;
  companyBranchName: null | string;
  departmentId: number | null;
  departmentName: null | string;
  positionId: null | number;
  positionName: null | string;
  status: number | null;
  whoCreate: null;
  dateCreate: null | string;
  dateModify: null | string;
};

type FilterStaffType = {
  companyBranchId?: number;
  status?: number;
  keyword?: string;
  page?: number;
  limit?: number;
  departmentId?: number;
  staffId?: string;
  username?: string;
  isFiltering?: boolean;
};

type staffCreateType = {
  staffNumber: string | null;
  username: string;
  password: string;
  staffName: string;
  phone: string;
  gender: number | null;
  dateOfBirth: string | null;
  daysOff: string | null;
  assets: string | null;
  provinces: string | null;
  companyBranchId: number | null;
  departmentId: number | null;
  positionId: number | null;
  status: number | null;
  ecmId?: string | null;
  filename?: string | null;
  mediaType?: string | null;
  whoUpload?: string | null;
  dateUpload?: string | null;
};

type FilterStaffByRoleType = {
  roleCode: string | null;
  companyBranchId?: number;
  departmentId?: number;
  isFiltering?: boolean;
  keyword?: string;
};

type StaffByRoleType = {
  key?: string;
  staffId: string;
  username: string;
  staffname: string;
  departmentCode: string;
  belongs: number;
};

type PermissionByRole = {
  key?: string;
  permissionGroupId: number;
  permissionGroupName: string | null;
  description: string | null;
  permissions: Array<PermissionType>;
};

type PermissionType = {
  key?: string;
  permissionId: number;
  name: string | null;
  description: string | null;
  belongs: number | null;
};

type StaffEditType = {
  staffId?: string;
  username?: string;
  password?: string;
  staffName?: string;
  phone?: string;
  gender?: number | null;
  dateOfBirth?: string | null;
  daysOff?: string | null;
  assets?: string | null;
  provinces?: string | null;
  companyBranchId?: number | null;
  departmentId?: number | null;
  positionId?: number | string | null;
  status?: number | null;
  address?: string;
  staffEmail?: string;
  ecmId?: string | null;
  filename?: string | null;
  mediaType?: string | null;
  whoUpload?: string | null;
  dateUpload?: string | null;
};

type FilterHistoryAccessType = {
  keyword?: string;
  staffId?: number;
  start?: string;
  end?: string;
  isFiltering?: boolean;
};

export type {
  StaffType,
  FilterStaffType,
  staffCreateType,
  StaffEditType,
  FilterStaffByRoleType,
  StaffByRoleType,
  PermissionByRole,
  FilterHistoryAccessType,
};
