type FilterUserListType = {
  unitId?: number;
  appartmentId?: number;
  statusId?: number;
  loginTypeId?: number;
  keySearch?: string;
};

type FilterUserAuthorizationType = {
  departmentId?: string;
  companyBranchId?: string;
  roleCode?: string;
  keyword?: string;
};

type UserType = {
  key?: number;
  index: number;
  accountName: string;
  userName: string;
  phoneNumber: string;
  avatar: string;
  unitName: string;
  position: string;
  status: string;
};

type AccessHistoryType = {
  key?: number;
  accessHistoryId: number | null;
  staffId: string | null;
  companyBranchName: string | null;
  username: string | null;
  loginTime: string | null;
  signoutTime: string | null;
  updateTime: string | null;
  ipAddress: string | null;
  clientInfo: string | null;
  status: number | null;
};

export type {
  FilterUserListType,
  UserType,
  AccessHistoryType,
  FilterUserAuthorizationType,
};
